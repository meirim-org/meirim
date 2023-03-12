import os
import boto3
import click
from requests import get
from ..common.regions import DEFAULT_ZONE, ZONES, get_aws_region_name

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
        'ports_to_open': [22, 3306],
    },
]


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
            group_name = f'{group["GroupName"]} ({group_id})'
            description = security_group['description']
            if owner:
                description += f' for {owner}'
            for port in security_group['ports_to_open']:
                name = f'{description}: CIDR IP {cidr_ip} for port {port} in {group_name}'
                is_defined = is_cidr_ip_defined_in_security_group_ingress(
                    ec2, group_id, port, cidr_ip)
                if revoke ^ is_defined:
                    defined_status = 'already defined' if is_defined else 'not defined'
                    click.echo(f'{name}: {defined_status} - skipping')
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
                action = 'removed' if revoke else 'defined'
                click.echo(f'{name}: {action}')


@click.command()
def external_ip():
    """Get current external IP"""
    click.echo(get_external_ip())


@click.command()
@click.option('-z', '--zone', type=click.Choice(ZONES, case_sensitive=False), default=DEFAULT_ZONE)
@click.option('-o', '--owner', required=True, default=os.getenv('USER'), help='Owner of the added access rules')
def authorize_my_ip(zone, owner):
    """Authorize security groups with current external IP address"""
    configure_security_groups_ingress(zone, owner=owner)


@click.command()
@click.option('-z', '--zone', type=click.Choice(ZONES, case_sensitive=False), default=DEFAULT_ZONE)
def revoke_my_ip(zone):
    """Revoke current IP address from security groups"""
    configure_security_groups_ingress(zone, revoke=True)
