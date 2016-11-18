import os
import json


def read(filename='.env'):
    env = {}
    with open(filename) as f:
        lines = f.readlines()
        for line in lines:
            kv = line.split('#')[0].strip().split('=')
            if len(kv) == 2:
                os.environ[kv[0]] = kv[1]
                env[kv[0]] = kv[1]
    return env


def create_from_json(input_filename, output_filename='.env'):
    with open(input_filename) as input:
        data = json.load(input)
        with open(output_filename, 'w') as output:
            for k, v in data.items():
                output.write("%s=%s\n" % (k, v))
