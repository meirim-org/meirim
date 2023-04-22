import shlex
import subprocess
import click
from ..common.regions import DEFAULT_ZONE, ZONES
from ..common.ssh import ssh_params


@click.command()
@click.option('-z', '--zone', type=click.Choice(ZONES, case_sensitive=False), default=DEFAULT_ZONE)
@click.argument('ssh_options', nargs=-1)
def ssh(zone, ssh_options):
    """SSH into Meirim's AWS EC2 instances"""

    # You can specify further arguments to ssh after a double-dash, for example:
    # > meirim ssh -z stg -- hostname
    # ip-172-31-24-129.eu-west-1.compute.internal

    ssh_username, ssh_server = ssh_params(zone)
    ssh_options = ' '.join(ssh_options)
    cmd = f'ssh {ssh_username}@{ssh_server} {ssh_options}'.strip()
    subprocess.run(shlex.split(cmd))
