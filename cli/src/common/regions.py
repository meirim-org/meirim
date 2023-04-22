import logging

AWS_REGIONS = dict(dev='eu-central-1', stg='eu-west-1', prd='eu-west-1')
ZONES = list(AWS_REGIONS.keys())
DEFAULT_ZONE = 'prd'

LOG = logging.getLogger(__name__)


def get_aws_region_name(zone):
    return AWS_REGIONS.get(zone, AWS_REGIONS[DEFAULT_ZONE])
