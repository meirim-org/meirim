def ssh_params(zone):
    subdomain = {'stg': 'stg.', 'dev': 'dev.'}.get(zone, '')
    hostname = f'{subdomain}meirim.org'
    username = 'ec2-user'
    return username, hostname
