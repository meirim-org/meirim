#!/usr/bin/env python3
import logging
import click
from rich.logging import RichHandler
from .authorization import commands as authorization
from .phpmyadmin import commands as phpmyadmin
from .ssh import commands as ssh

FORMAT = '%(message)s'
# NOTSET
logging.basicConfig(level='INFO', format=FORMAT,
                    datefmt='[%X]', handlers=[RichHandler()])
logging.getLogger('paramiko').setLevel(logging.WARNING)
LOG = logging.getLogger(__name__)


@click.group()
def entry_point():
    """Manage Meirim"""


entry_point.add_command(authorization.external_ip)
entry_point.add_command(authorization.authorize_my_ip)
entry_point.add_command(authorization.revoke_my_ip)
entry_point.add_command(phpmyadmin.phpmyadmin)
entry_point.add_command(ssh.ssh)

if __name__ == '__main__':
    entry_point()
