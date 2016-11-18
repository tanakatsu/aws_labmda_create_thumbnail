# AWS Lambda Create Thumbnail (Node.js and Python)

## What's this

Thumbnail creating sample code for Node.js and Python.

## To run on AWS

You have to install [AWS CLI](https://aws.amazon.com/cli/) at first.

For Mac OSX user,

```
$ brew install awscli
or
$ pip install awscli
```

### Node.js

Rename .env.sample to .env and edit it.

Next, edit event.json.

Then,

```
./deploy.sh # once 
./exec.sh
```

### Python

You need to install [lambda-uploader](https://github.com/rackerlabs/lambda-uploader).

```
$ pip install lambda-uploader
```

Next, edit env.json, lambda.json and event.json.

Then,

```
$ ./deploy.sh # once
$ ./exec.sh
```

## To run on local machine

### Node.js
Rename .env.sample to .env and edit it.

Next, edit event.json.

Then,

```
$ npm install # once
$ ./exec_local.sh
```

### Python

You need to install PIL(Pillow) and boto3.

```
$ pip install Pillow
$ pip install boto3
```

Next, edit env.json and event.json.

Then, 

```
./exec_local.sh
```


