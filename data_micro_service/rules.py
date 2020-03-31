"""
This is the rules file.
Each function that starts with 'rl_' will be computed for each plan. All the 'rl_' functions output will be summed
to compute the regression for a plan.
The last rule will be the score of a given plan.
"""
from statsmodels.distributions.empirical_distribution import ECDF


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


def ecdf_rule(regressor, plan, category, unit):
    change = find_change(plan, category, unit)
    if change is None:
        return None
    ecdf = ECDF(regressor.samples_dict[category + ' ' + unit])
    return ecdf(change.total_change)


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


def rl_megoorim_yahad_ecdf(clf, plan, scores_dict):
    return 1, ecdf_rule(clf, plan, 'מגורים', 'יח"ד')


def rl_megoorim_mr__ecdf(clf, plan, scores_dict):
    return 1, ecdf_rule(clf, plan, 'מגורים', 'מ"ר')


def rl_mivney_tsiboor_mr_ecdf(clf, plan, scores_dict):
    return 0.65, ecdf_rule(clf, plan, 'מבני ציבור', 'מ"ר')


def rl_taasoka_mr_ecdf(clf, plan, scores_dict):
    return 1, ecdf_rule(clf, plan, 'תעסוקה', 'מ"ר')


def rl_mishar_mr_ecdf(clf, plan, scores_dict):
    return 1, ecdf_rule(clf, plan, 'מסחר', 'מ"ר')


def rl_dirot_ktanot_yahad_ecdf(clf, plan, scores_dict):
    return 0.1, ecdf_rule(clf, plan, 'דירות קטנות', 'יח"ד')


def rl_hotel_rooms_mr_ecdf(clf, plan, scores_dict):
    return 1, ecdf_rule(clf, plan, 'חדרי מלון / תיירות', 'מ"ר')


def rl_hotel_rooms_heder_ecdf(clf, plan, scores_dict):
    return 1, ecdf_rule(clf, plan, 'חדרי מלון / תיירות', 'חדר')


def rl_dirot_ktanot_kafri_yahad_ecdf(clf, plan, scores_dict):
    return 0.1, ecdf_rule(clf, plan, 'דירות קטנות בישובים כפריים', 'יח"ד')


def rl_dyoor_meyoohad_yahad_ecdf(clf, plan, scores_dict):
    return 0.1, ecdf_rule(clf, plan, 'דיור מיוחד', 'יח"ד')


def rl_dyoor_meyoohad_mr_ecdf(clf, plan, scores_dict):
    return 0.1, ecdf_rule(clf, plan, 'דיור מיוחד', 'מ"ר')


def rl_dirot_lehaskara_yahad_ecdf(clf, plan, scores_dict):
    return 0.3, ecdf_rule(clf, plan, 'דירות להשכרה', 'יח"ד')


def rl_all_composer(clf, plan, score_dict):
    # each value of score_dict is a 2-tuple: (importance, score)
    # this calculation is weighted average
    importance_loc = 0
    score_loc = 1
    relevant_outputs = [tup for tup in score_dict.values() if tup[score_loc] is not None]
    sum_of_importance = sum(map(lambda tup: tup[importance_loc], relevant_outputs))
    sum_of_scores_and_importances = sum(map(lambda tup: tup[importance_loc] * tup[score_loc], relevant_outputs))
    if sum_of_importance == 0:
        # it means that there's no relevant rules at all - it's a boring plan
        return 0
    return sum_of_scores_and_importances / sum_of_importance
