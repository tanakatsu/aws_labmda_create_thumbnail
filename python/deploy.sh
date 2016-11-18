echo 'Deployment started'

# lambda-uploader is required. Install lambda-uploader on your machine.
# 
# lambda-uploader
# https://github.com/rackerlabs/lambda-uploader

if [ -e lambda_function.zip ]; then
  rm lambda_function.zip
  echo Removed lambda_function.zip
fi

# Create .env
python -c "import dotenv; dotenv.create_from_json('env.json', '.env')"
echo Created .env

# Set environment variables
export $(cat .env | xargs)
echo Updated environment variables

cp -r PIL_ec2 PIL
lambda-uploader -V

rm -r PIL
rm .env
echo Cleaned temporal files

echo finished
