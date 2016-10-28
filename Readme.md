# AWS Lambda Create Thumbnail (Node.js and Python)

## What's this

Thumbnail creating sample code for Node.js and Python.

## To run on AWS

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

Next, edit lambda.json and event.json.

Then,

```
./deploy.sh # once
./exec.sh
```

## To run on local machine

### Node.js
Rename .env.sample to .env and edit it.

Next, edit event.json.

Then,

```
npm install # once
./exec_local.sh
```

### Python

You need to install PIL.

Next, edit event.json. 

Then, 

```
./exec_local.sh
```


