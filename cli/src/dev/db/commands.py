from pathlib import Path
import click
import pandas as pd
from sqlalchemy import text
from ...common.regions import DEFAULT_ZONE, ZONES
from .common import get_db_connection


@click.group()
def db():
    """Database commands"""


@db.command()
@click.option('-z', '--zone', type=click.Choice(ZONES, case_sensitive=False), default=DEFAULT_ZONE)
@click.option('-t', '--table', required=True, help='Name of database table')
@click.option('-o', '--output-file', type=click.Path(), required=True, help='Outputfile name')
def dump_table(zone, table, output_file):
    output_file = Path(output_file)
    assert output_file.suffix == '.parquet', 'Output filename must be a Parquet file'

    sql_query = f'SELECT * FROM {table}'
    with get_db_connection(zone) as conn:
        df = pd.read_sql(text(sql_query), conn)
    df.to_parquet(output_file)
