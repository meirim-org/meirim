import logging
import click
from .db import commands as db_commands

LOG = logging.getLogger(__name__)


@click.group()
def dev():
    """Developers aids"""


dev.add_command(db_commands.db)
