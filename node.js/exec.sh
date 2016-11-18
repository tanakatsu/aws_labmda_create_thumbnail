#!/bin/bash

#
# AWS-CLI is required. Install aws-cli on your machine.
#

# Set environment variables
export $(cat .env | xargs)
echo Updated environment variables

# Invoke lambda function
echo Invoking...
aws lambda invoke --invocation-type RequestResponse --function-name NodeThumb --payload file://event.json outputfile.txt
