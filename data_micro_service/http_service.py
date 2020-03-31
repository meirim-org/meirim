import json
from nameko.web.handlers import http

import data_tools
from plan import Plan
from plan_regressor import PlanRegressor

"""
IMPORTANT NOTE: TO RUN THIS SERVICE, ALL OF THE DEPENDENCIES SHOULD BE INSTALLED ON THE BASE INTERPETER.
NAMEKO DOES NOT RUN ON THE PROJECT-LOCAL INTERPETER.

To run this service, type in cmd:
nameko run http_service

"""

class HttpService:
    """
    This class is the HTTP service itself - it handles HTTP requests and sends HTTP responses
    """
    name = "http_service"


    @http('POST', '/post')
    def do_post(self, request):
        db = data_tools.get_db()
        all_plans = Plan.get_all_plans(db)
        regressor = PlanRegressor(db, all_plans)
        lst_of_plans = regressor.regress_all_plans()
        # Turn plans to data plans, this is done to expose only the relevant data to the clients
        lst_of_data_plans = [PlanData(**plan_and_score) for plan_and_score in regressor.regress_all_plans()]
        # Turn data plans into dictionaries, this is done to allow JSON serialization
        lst_of_dicts_to_dump = [dt_plan.__dict__ for dt_plan in lst_of_data_plans]
        return json.dumps(lst_of_dicts_to_dump)


class PlanData:
    """
    This class is used to store all the data of a single plan.
    It should be returned in the HTTP response.
    Later, it is formatted into JSON.
    """

    def __init__(self, plan, score):
        """
        This method shall convert a "normal" Plan object to the data that we wish to send to this service clients
        :param plan: Plan object
        """
        self.id = plan.id
        self.score = score
