"""
This is the rules file.
Each function that starts with 'rl_' will be computed for each plan. All the 'rl_' functions output will be summed
to compute the regression for a plan.
"""


def find_change(plan, category, unit):
    """
    finds the change in the given category and unit in the given plan
    :return: Change object
    """
    for change in plan.area_changes:
        if change.category == category and change.unit == unit:
            return change
    return None


def stdev_avg_rule(regressor, plan, category, unit, stdev_dividor, multiplier_low, multiplier_high):
    """
    A general rule for a plan that uses linear_2_level_func
    """
    change = find_change(plan, category, unit)
    if change is None:
        return None
    return linear_2_level_func(regressor, category, unit, stdev_dividor, multiplier_low, multiplier_high, change)


def linear_value_func(multiplier, total_change):
    return multiplier * total_change


def linear_2_level_func(regressor, category, unit, stdev_dividor, multiplier_low, multiplier_high, change):
    """
    A 2-step linear function:
    1. A slower linear function when x is below mean - stdev / stdev_dividor
    2. A faster linear function when x is above mean - stdev / stdev_dividor
    :return: a number that denotes how interesting the change is
    """
    stat = regressor.stats_dict[' '.join([category, unit])]
    total_change = change.total_change
    if change.total_change > float(stat.mean) - float(stat.stdev / stdev_dividor):
        return linear_value_func(multiplier_high, total_change)
    else:
        return linear_value_func(multiplier_low, total_change)


def rl_megoorim_yahad_stdev_avg(clf, plan):
    return stdev_avg_rule(clf, plan, 'מגורים', 'יח"ד', 10, 7, 10)


def rl_megoorim_mr_stdev_avg(clf, plan):
    return stdev_avg_rule(clf, plan, 'מגורים', 'מ"ר', 10, 1.4, 2)


def rl_mivney_tsiboor_mr_stdev_avg(clf, plan):
    return stdev_avg_rule(clf, plan, 'מבני ציבור', 'מ"ר', 3.5, 1, 2)


def rl_taasoka_mr_stdev_avg(clf, plan):
    return stdev_avg_rule(clf, plan, 'תעסוקה', 'מ"ר', 5, 4, 5)


def rl_mishar_mr_stdev_avg(clf, plan):
    return stdev_avg_rule(clf, plan, 'מסחר', 'מ"ר', 4, 6, 12)


def rl_dirot_ktanot_yahad_stdev_avg(clf, plan):
    return stdev_avg_rule(clf, plan, 'דירות קטנות', 'יח"ד', 7, 7, 10)


def rl_hotel_rooms_mr_stdev_avg(clf, plan):
    return stdev_avg_rule(clf, plan, 'חדרי מלון / תיירות', 'מ"ר', 7, 0.5, 1)


def rl_hotel_rooms_heder_stdev_avg(clf, plan):
    return stdev_avg_rule(clf, plan, 'חדרי מלון / תיירות', 'חדר', 7, 7, 11)


def rl_dirot_ktanot_kafri_yahad_stdev_avg(clf, plan):
    return stdev_avg_rule(clf, plan, 'דירות קטנות בישובים כפריים', 'יח"ד', 10, 7, 10)


def rl_dyoor_meyoohad_yahad_stdev_avg(clf, plan):
    return stdev_avg_rule(clf, plan, 'דיור מיוחד', 'יח"ד', 10, 7, 10)


def rl_dyoor_meyoohad_mr_stdev_avg(clf, plan):
    return stdev_avg_rule(clf, plan, 'דיור מיוחד', 'מ"ר', 10, 1.4, 2)


def rl_dirot_lehaskara_yahad_stdev_avg(clf, plan):
    return stdev_avg_rule(clf, plan, 'דירות להשכרה', 'יח"ד', 10, 10, 14)
