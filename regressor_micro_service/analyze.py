import seaborn as sns
import numpy as np
import matplotlib.pyplot as plt
import data_tools


def draw_cat_unit(db, category, unit):
    vals = data_tools.get_conditional_vals(db, ['totalChange'], 'category = %s AND unit = %s', (category, unit),
                                           'plan_area_changes')
    vals = list(map(lambda tup: tup[0], vals))

    sns.set_style('whitegrid')
    ax = sns.kdeplot(np.array(vals), bw=0.3)
    ax.set_title(' '.join([category, unit])[::-1])
    ax.set_xlabel(unit[::-1])
    ax.set_ylabel('density')
    plt.show()


def draw_all_cats(db):
    crsr = db.cursor()
    crsr.execute("""SELECT category, unit
        FROM meirim.plan_area_changes
        GROUP BY category, unit""")
    tup_from_db = crsr.fetchall()
    cats_and_units = [data_tools.tup_to_readable_tup(tup) for tup in tup_from_db]
    [draw_cat_unit(db, tup[0], tup[1]) for tup in cats_and_units]


if __name__ == '__main__':
    db = data_tools.get_db()
    draw_all_cats(db)
