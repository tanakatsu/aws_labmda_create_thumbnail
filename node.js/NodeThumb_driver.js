require('dotenv').config();

//YOUR DATA TO BE PASSED TO LAMBDA FUNCTION.
var event = require('./event.json');  
console.log('event=', event);

//BUILD STAB OF context OBJECT.
var context = {
  invokeid: 'invokeid',
  done: function(err, message){
    return;
  }
};


//RUN YOUR HANDLER
var lambda = require("./NodeThumb.js");
lambda.handler(event, context);
