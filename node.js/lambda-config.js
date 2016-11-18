require('dotenv').config();
var util = require('util');
var functionName = 'NodeThumb';

module.exports = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION,
  handler: util.format('%s.handler', functionName),
  role: process.env.LAMBDA_ROLE,
  functionName: functionName,
  timeout: 60,
  memorySize: 256,
  runtime: 'nodejs4.3'
}
