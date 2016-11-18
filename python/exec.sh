#!/bin/bash

#
# AWS-CLI is required. Install aws-cli on your machine.
#

# Create .env
python -c "import dotenv; dotenv.create_from_json('env.json', '.env')"

# Set environment variables
export $(cat .env | xargs)
echo Updated environment variables

# Invoke lambda function
echo Invoking...
aws lambda invoke --invocation-type RequestResponse --function-name PyThumb --payload file://event.json outputfile.txt
rm .env

