echo 'Deployment started'

# lambda-uploader is required. Install lambda-uploader on your machine.
# 
# lambda-uploader
# https://github.com/rackerlabs/lambda-uploader

cp -r PIL_ec2 PIL
lambda-uploader # or lambda-uploader --profile=altenative-profile
rm -r PIL

echo 'finished successfully'
