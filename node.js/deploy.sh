#!/bin/bash

echo 'Deployment started.'

if [ ! -e package.json -o ! -e lambda-config.js ]; then
  echo 'Error: you are not on right directory to deploy. Please check your directory.'
  exit 1
fi

gulp deploy
echo 'finished successfully.'
