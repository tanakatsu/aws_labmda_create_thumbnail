echo 'Deployment started'

# lambda-uploader is required. Install lambda-uploader on your machine.
# 
# lambda-uploader
# https://github.com/rackerlabs/lambda-uploader

if [ -n "$1" ]; then
  profile=$2
else
  profile='default'
fi
echo profile=${profile}

if [ -e lambda_function.zip ]; then
  rm lambda_function.zip
  echo 'removed lambda_function.zip'
fi

cp -r PIL_ec2 PIL
lambda-uploader -V --profile=${profile}

rm -r PIL

echo 'finished'
