import logging
import click
from .db import commands as db_commands
from .phpmyadmin import commands as phpmyadmin_commands

LOG = logging.getLogger(__name__)


@click.group()
def dev():
    """Developers aids"""
    pass


dev.add_command(db_commands.db)
dev.add_command(phpmyadmin_commands.phpmyadmin)
