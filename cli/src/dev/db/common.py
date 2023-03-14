import json
from contextlib import contextmanager
import boto3
import paramiko
import sqlalchemy as sa
from ...common.regions import DEFAULT_ZONE, ZONES, get_aws_region_name
from ...common.ssh import ssh_params


def get_host_config(ssh_username, ssh_server):
    with paramiko.SSHClient() as ssh:
        ssh.load_system_host_keys()
        ssh.connect(ssh_server, username=ssh_username)
        cmd = 'cat /home/ec2-user/meirim/server/config/local.json'
        _, stdout, _ = ssh.exec_command(cmd)
        return json.load(stdout)


def database_connection_info(ssh_username, ssh_server):
    host_config = get_host_config(ssh_username, ssh_server)
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


def get_db_connection_info(zone):
    db_instance_name = f'{zone}-db'
    db_host = ec2_instance_public_dns_name(zone, db_instance_name)

    ssh_username, ssh_server = ssh_params(zone)
    db_user, db_password, _ = database_connection_info(ssh_username, ssh_server)
    return db_host, db_user, db_password


def get_db_connection_string(zone):
    db_host, db_user, db_password = get_db_connection_info(zone)
    database = 'meirim'
    return f'mariadb+mariadbconnector://{db_user}:{db_password}@{db_host}:3306/{database}'


@contextmanager
def get_db_connection(zone):
    url = get_db_connection_string(zone)
    engine = sa.create_engine(url)
    with engine.connect() as conn:
        yield conn
