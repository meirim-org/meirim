import logging
import shlex
import subprocess
import click
from ...common.regions import DEFAULT_ZONE, ZONES
from ..db.common import get_db_connection_info

LOG = logging.getLogger(__name__)


@click.command()
@click.option('-z', '--zone', type=click.Choice(ZONES, case_sensitive=False), default=DEFAULT_ZONE)
def phpmyadmin(zone):
    """Spawn phpMyAdmin docker locally"""
    db_host, db_user, db_password = get_db_connection_info(zone)
    env_vars = {
        'PMA_USER': db_user,
        'PMA_PASSWORD': db_password,
        'MYSQL_ROOT_PASSWORD': db_password,
        'PMA_HOST': db_host,
    }
    LOG.info("Phpmyadmin will now run in http://localhost:8080")
    env_vars_params = ' '.join(f'-e {k}={v}' for k, v in env_vars.items())
    cmd = f'docker run --rm -it --name phpmyadmin {env_vars_params} -p 8080:80 phpmyadmin'
    subprocess.run(shlex.split(cmd))
