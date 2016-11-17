if [ -n "$1" ]; then
  profile=$1
else
  profile='default'
fi
echo profile=${profile}

aws lambda invoke --invocation-type RequestResponse --function-name PyThumb --payload file://event.json --profile ${profile} outputfile.txt

