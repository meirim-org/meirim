#!/usr/bin/env python3
import logging
import boto3
import click
from rich.logging import RichHandler
from .authorization import commands as authorization
from .dev import commands as dev
from .ssh import commands as ssh

FORMAT = '%(message)s'
# NOTSET
logging.basicConfig(level='INFO', format=FORMAT,
                    datefmt='[%X]', handlers=[RichHandler()])
logging.getLogger('paramiko').setLevel(logging.WARNING)
boto3.set_stream_logger('', logging.WARNING)
LOG = logging.getLogger(__name__)


@click.group()
def entry_point():
    """Manage Meirim"""


entry_point.add_command(authorization.authorization)
entry_point.add_command(dev.dev)
entry_point.add_command(ssh.ssh)

if __name__ == '__main__':
    entry_point()
