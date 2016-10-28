import json
from pythumb import lambda_handler

with open('event.json') as f:
    event = json.load(f)
    print 'event=', event
    lambda_handler(event, None)
