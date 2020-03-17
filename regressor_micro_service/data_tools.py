import mysql.connector
import json

INTERESTING_CLMNS = ['id', 'sent', 'OBJECTID', 'PLAN_COUNTY_NAME', 'PL_NUMBER', 'PL_NAME', 'PLAN_CHARACTOR_NAME',
                     'data', 'plan_url', 'goals_from_mavat', 'jurisdiction', 'status', 'areaChanges']
db = mysql.connector.connect(
        host="localhost",
        user="root",
        passwd="",
        database='meirim',
        auth_plugin='mysql_native_password'
    )


def tup_to_readable_tup(tup):
    """
    For some reason, MySQL fetch will return string data as bytearray.
    This method returns a tuple with readable strings.
    :param tup: A tuple that was fetched from MySQL db. It will contain bytearrays instead of strings.
    :return: A tuple with readable strings instead of bytearrays.
    """
    def byte_lst_to_readable(itm):
        if type(itm) == bytearray:
            return itm.decode()
        return itm

    return tuple(map(byte_lst_to_readable, tup))


def get_vals(db, clmns, table='plan', top=None):
    """
    :param table: a string that denotes the table
    :param clmns: a list of columns
    :param top: an integer
    :return: a list of tuples
    EXAMPLE: To do the query 'SELECT a, b, c FROM someTbl'
    you should use get_vals(db, ['a', 'b', 'c'], 'someTbl')
    EXAMPLE: To do the query 'SELECT a, b, c FROM someTbl LIMIT 100'
    you should use get_vals(db, ['a', 'b', 'c'], 'someTbl', 100)
    """
    cursor = db.cursor()
    if top is None:
        cursor.execute('SELECT ' + ','.join(clmns) + ' FROM meirim.' + table)
    else:
        cursor.execute('SELECT ' + ','.join(clmns) + ' FROM meirim.' + table + ' LIMIT ' + str(top))
    return cursor.fetchall()


def get_conditional_vals(db, clmns, where, params=(), table='plan', top=None):
    """
    :param params: params for the where clause, a tuple.
    :param where: the where clause
    :param table: a string that denotes the table
    :param clmns: a list of columns
    :param top: an integer
    :return: a list of tuples
    EXAMPLE 1: To do the query 'SELECT a, b, c FROM someTbl WHERE a=1 AND b=2'
    you should use get_conditional_vals(db, ['a', 'b', 'c'], 'a=? AND b=?', (1, 2), 'someTbl')
    EXAMPLE 2: To do the query 'SELECT a, b, c FROM someTbl WHERE a=1 AND b=2 LIMIT 100'
    you should use get_conditional_vals(db, ['a', 'b', 'c'], 'a=? AND b=?', (1, 2), 'someTbl', 100)
    """
    cursor = db.cursor()
    if top is None:
        cursor.execute('SELECT ' + ','.join(clmns) + ' FROM meirim.' + table + ' WHERE ' + where, params)
    else:
        cursor.execute('SELECT ' + ','.join(clmns) + ' FROM meirim.' + table + ' WHERE ' + where +
                       ' LIMIT ' + str(top), params)
    return cursor.fetchall()


def get_db():
    return db
