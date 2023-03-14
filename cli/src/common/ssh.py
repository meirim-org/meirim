from contextlib import contextmanager
import paramiko


def ssh_params(zone):
    subdomain = {'stg': 'stg.', 'dev': 'dev.'}.get(zone, '')
    ssh_hostname = f'{subdomain}meirim.org'
    ssh_username = 'ec2-user'
    return ssh_username, ssh_hostname


@contextmanager
def ssh_connection(zone):
    with paramiko.SSHClient() as ssh:
        ssh_username, ssh_server = ssh_params(zone)
        ssh.load_system_host_keys()
        ssh.set_missing_host_key_policy(paramiko.WarningPolicy())
        ssh.connect(ssh_server, username=ssh_username)
        yield ssh
