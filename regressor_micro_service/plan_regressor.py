from inspect import getmembers, isfunction

import mysql.connector
import data_tools
import statistics
import rules
from plan import Plan


class StatisticsInfo:
    def __init__(self, mean, stdev):
        self.mean = mean
        self.stdev = stdev


class PlanRegressor:

    def __init__(self, db):
        crsr = db.cursor()
        crsr.execute("""
        SELECT category, unit, AVG(totalChange), STDDEV(totalChange)
        FROM meirim.plan_area_changes
        GROUP BY category, unit""")
        cat_in_ans, unit_in_ans, avg_in_ans, stdev_in_ans = 0, 1, 2, 3
        stats = crsr.fetchall()
        self.stats_dict = {}
        for fetched_tup in stats:
            tup = data_tools.tup_to_readable_tup(fetched_tup)
            key = tup[cat_in_ans] + ' ' + str(tup[unit_in_ans])    # Category + ' ' + unit. for example: מגורים יח"ד
            self.stats_dict[key] = StatisticsInfo(tup[avg_in_ans], tup[stdev_in_ans])

    def regress(self, pln):
        importance_sum = 0
        # Get all the rules function
        rules_functions = [o[1] for o in getmembers(rules) if isfunction(o[1]) and o[0].startswith('rl_')]
        for rule in rules_functions:
            out = rule(self, pln)
            if out is not None:
                importance_sum += out
        return importance_sum

    @staticmethod
    def regression_for_all_plans(db):
        plans = Plan.get_all_plans(db)
        regressor = PlanRegressor(db)
        regressed = [(plan, regressor.regress(plan)) for plan in plans]
        ordered = sorted(regressed, key=lambda tup: tup[1])  # sort from lower score to higher score
        return [tup[0] for tup in ordered]  # Returns only the plans, ordered.

