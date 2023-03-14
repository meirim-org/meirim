import logging
import click
from .phpmyadmin import commands as phpmyadmin_commands

LOG = logging.getLogger(__name__)


@click.group()
def dev():
    """Developers aids"""
    pass


dev.add_command(phpmyadmin_commands.phpmyadmin)
