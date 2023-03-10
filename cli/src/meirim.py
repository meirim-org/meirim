#!/usr/bin/env python3
import json
import logging
import os
import shlex
import subprocess
import boto3
import click
import paramiko
from requests import get
from rich.logging import RichHandler

AWS_REGIONS = dict(dev='eu-central-1', stg='eu-west-1', prd='eu-west-1')
ZONES = list(AWS_REGIONS.keys())
DEFAULT_ZONE = 'prd'
SECURITY_GROUPS = [
    {
        'description': 'ssh',
        'group_name_pattern': [
            '%(zone)s-service-service-sg',
        ],
        'ports_to_open': [22],
    },
    {
        'description': 'db access',
        'group_name_pattern': [
            '%(zone)s-db-sg',
        ],
        'ports_to_open': [3306],
    },
]

FORMAT = '%(message)s'
# NOTSET
logging.basicConfig(level='INFO', format=FORMAT,
                    datefmt='[%X]', handlers=[RichHandler()])
logging.getLogger('paramiko').setLevel(logging.WARNING)
LOG = logging.getLogger(__name__)


def get_aws_region_name(zone):
    return AWS_REGIONS.get(zone, AWS_REGIONS[DEFAULT_ZONE])


def get_external_ip():
    return get('https://api.ipify.org').text


def is_cidr_ip_defined_in_security_group_ingress(ec2, group_id, port, cidr_ip):
    response = ec2.describe_security_groups(GroupIds=[group_id])
    security_groups = response['SecurityGroups']
    assert len(security_groups) == 1
    ip_permissions = security_groups[0]['IpPermissions']
    ip_perm = next(
        filter(lambda rule: rule['FromPort'] == port, ip_permissions))
    return any(filter(lambda x: x['CidrIp'] == cidr_ip, ip_perm['IpRanges']))


@click.group()
def cli():
    """Manage Meirim"""


@cli.command()
def external_ip():
    """Get current external IP"""
    click.echo(get_external_ip())


def configure_security_groups_ingress(zone, *, owner=None, revoke=False):
    cidr_ip = f'{get_external_ip()}/32'
    region_name = get_aws_region_name(zone)
    ec2 = boto3.client('ec2', region_name=region_name)

    for security_group in SECURITY_GROUPS:
        group_names = [x % dict(zone=zone)
                       for x in security_group['group_name_pattern']]
        res = ec2.describe_security_groups(
            Filters=[dict(Name='group-name', Values=group_names)])
        for group in res['SecurityGroups']:
            group_id = group['GroupId']
            group_name = f"{group['GroupName']} ({group_id})"
            description = f'{security_group["description"]} for {owner}'
            for port in security_group['ports_to_open']:
                name = f"{description}: CIDR IP {cidr_ip} for port {port} in {group_name}"
                is_defined = is_cidr_ip_defined_in_security_group_ingress(
                    ec2, group_id, port, cidr_ip)
                if revoke ^ is_defined:
                    defined_status = 'already defined' if is_defined else 'not defined'
                    click.echo(f"{name}: {defined_status} - skipping")
                    continue

                func = ec2.revoke_security_group_ingress if revoke else ec2.authorize_security_group_ingress
                func(
                    GroupId=group_id,
                    IpPermissions=[
                        {
                            'IpRanges': [
                                {'CidrIp': cidr_ip, 'Description': description}],
                            'FromPort': port,
                            'IpProtocol': 'TCP',
                            'ToPort': port,
                        }
                    ]
                )
                action = "removed" if revoke else "defined"
                click.echo(f"{name}: {action}")


@cli.command()
@click.option('-z', '--zone', type=click.Choice(ZONES, case_sensitive=False), default=DEFAULT_ZONE)
@click.option('-o', '--owner', required=True, default=os.getenv('USER'), help='Owner of the added access rules')
def authorize_my_ip(zone, owner):
    """Authorize security groups with current external IP address"""
    configure_security_groups_ingress(zone, owner=owner)


@cli.command()
@click.option('-z', '--zone', type=click.Choice(ZONES, case_sensitive=False), default=DEFAULT_ZONE)
def revoke_my_ip(zone):
    """Revoke current IP address from security groups"""
    configure_security_groups_ingress(zone, revoke=True)


def ssh_params(zone):
    subdomain = {'stg': 'stg.', 'dev': 'dev.'}.get(zone, '')
    hostname = f'{subdomain}meirim.org'
    username = 'ec2-user'
    return username, hostname


@cli.command()
@click.option('-z', '--zone', type=click.Choice(ZONES, case_sensitive=False), default=DEFAULT_ZONE)
@click.argument('ssh_options', nargs=-1)
def ssh(zone, ssh_options):
    """SSH into Meirim's AWS EC2 instances"""

    # You can specify further arguments to ssh after a double-dash, for example:
    # > meirim ssh -z stg -- hostname
    # ip-172-31-24-129.eu-west-1.compute.internal

    username, hostname = ssh_params(zone)
    ssh_options = ' '.join(ssh_options)
    cmd = f'ssh {username}{hostname} {ssh_options}'.strip()
    subprocess.run(shlex.split(cmd))


def get_host_config(username, hostname):
    with paramiko.SSHClient() as ssh:
        ssh.load_system_host_keys()
        ssh.connect(hostname, username=username)
        cmd = 'cat /home/ec2-user/meirim/server/config/local.json'
        _, stdout, _ = ssh.exec_command(cmd)
        return json.load(stdout)


def database_connection_info(username, server_hostname):
    host_config = get_host_config(username, server_hostname)
    database_config = host_config['database']
    assert database_config is not None
    assert database_config['client'] == 'mysql'
    db_connection_config = database_config['connection']
    user = db_connection_config['user']
    password = db_connection_config['password']
    db = db_connection_config['database']
    return user, password, db


def ec2_instance_public_dns_name(zone, instance_name):
    region_name = get_aws_region_name(zone)
    ec2 = boto3.client('ec2', region_name=region_name)
    filters = [{'Name': 'tag:Name', 'Values':  [instance_name]}]
    response = ec2.describe_instances(Filters=filters)
    reservations = response['Reservations']
    assert len(reservations) == 1
    instances = reservations[0]['Instances']
    assert len(instances) == 1
    return instances[0]['PublicDnsName']


@ cli.command()
@ click.option('-z', '--zone', type=click.Choice(ZONES, case_sensitive=False), default=DEFAULT_ZONE)
def phpmyadmin(zone):
    """Spawn phpMyAdmin docker locally"""
    db_instance_name = f'{zone}-db'
    db_host = ec2_instance_public_dns_name(zone, db_instance_name)

    username, server_hostname = ssh_params(zone)
    user, password, _ = database_connection_info(username, server_hostname)
    env_vars = {
        'PMA_USER': user,
        'PMA_PASSWORD': password,
        'MYSQL_ROOT_PASSWORD': password,
        'PMA_HOST': db_host,
    }
    LOG.info("Phpmyadmin will now run in http://localhost:8080")
    env_vars_params = ' '.join(f'-e {k}={v}' for k, v in env_vars.items())
    cmd = f'docker run --rm -it --name phpmyadmin {env_vars_params} -p 8080:80 phpmyadmin'
    subprocess.run(shlex.split(cmd))


if __name__ == '__main__':
    cli()
