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
    RULES_FILE_NM = 'rules.py'

    def __init__(self, db, all_plans):
        self.all_plans = all_plans
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
            key = tup[cat_in_ans] + ' ' + str(tup[unit_in_ans])  # Category + ' ' + unit. for example: מגורים יח"ד
            self.stats_dict[key] = StatisticsInfo(tup[avg_in_ans], tup[stdev_in_ans])

        self.samples_dict = {}
        for plan in all_plans:
            for area_change in plan.area_changes:
                key = area_change.category + ' ' + area_change.unit
                if key not in self.samples_dict:
                    self.samples_dict[key] = []
                self.samples_dict[key].append(area_change.total_change)

    def regress(self, pln):
        ordered_funcs_name = []
        with open('rules.py', encoding='utf-8') as fd:
            for line in fd:
                # note that [0] will be the statement itself, [1] and on will be comments
                statement = line.split('#')[0]
                stripped = statement.strip()
                if stripped.startswith('def rl_'):
                    # the function name will be the first word
                    no_def = stripped.replace('def ', '', 1)
                    # we have 2 splits because def func() is fine, and def func () is fine too
                    # (notice the space before the ())
                    first_word = no_def.split(' ')[0]
                    func_name = first_word.split('(')[0]
                    ordered_funcs_name.append(func_name)
        # By now, ordered_funcs_name will be ordered by the order in the rule.py file
        # Get all the rules function and their names, notice that they are unordered
        # o[0] is the name of the function, o[1] is the function itself
        name_index = 0
        function_index = 1
        functions_lst = [o for o in getmembers(rules) if isfunction(o[function_index]) and o[name_index].startswith('rl')]
        sorted_rules = sorted(functions_lst, key=lambda tup: ordered_funcs_name.index(tup[name_index]))
        score_dict = {}
        for rule_tup in sorted_rules:
            rl_score = rule_tup[function_index](self, pln, score_dict)
            score_dict[rule_tup[name_index]] = rl_score
        # returns the score of the last rule written in the file
        return score_dict[sorted_rules[-1][name_index]]
        # return self.compute_score(rules_outputs)

    def regress_all_plans(self):
        regressed = [(plan, self.regress(plan)) for plan in self.all_plans]
        return sorted(regressed, key=lambda tup: - tup[1])  # sort from high score to low score
        # return [tup[0] for tup in ordered]  # Returns only the plans, ordered.
