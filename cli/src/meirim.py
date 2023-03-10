#!/usr/bin/env python3
import logging
import os
import shlex
import subprocess
import boto3
import click
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
LOG = logging.getLogger(__name__)


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
    region_name = AWS_REGIONS.get(zone, AWS_REGIONS[DEFAULT_ZONE])
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


@cli.command()
@click.option('-z', '--zone', type=click.Choice(ZONES, case_sensitive=False), default=DEFAULT_ZONE)
@click.argument('ssh_options', nargs=-1)
def ssh(zone, ssh_options):
    """SSH into Meirim's AWS EC2 instances"""

    # You can specify further arguments to ssh after a double-dash, for example:
    # > meirim ssh -z stg -- hostname
    # ip-172-31-24-129.eu-west-1.compute.internal

    subdomain = {'stg': 'stg.', 'dev': 'dev.'}.get(zone, '')
    ssh_options = ' '.join(ssh_options)
    cmd = f'ssh ec2-user@{subdomain}meirim.org {ssh_options}'.strip()
    subprocess.run(shlex.split(cmd))


if __name__ == '__main__':
    cli()
