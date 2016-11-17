// dependencies
var async = require('async');
var AWS = require('aws-sdk');
var gm = require('gm').subClass({ imageMagick: true });
var util = require('util');
var path = require('path');
var inkjet = require('inkjet');
require('date-utils');

// load envirnment variables
require('dotenv').config();

// set credentials
var creds = AWS.Credentials(process.env.LOOKME_NOTE_AWS_ACCESS_KEY_ID,
                            process.env.LOOKME_NOTE_AWS_SECRET_ACCESS_KEY);
AWS.config.credentials = creds;

// get reference to S3 client
var s3 = new AWS.S3();

exports.handler = function(event, context) {
  // console.log(process.env);

  // Read options from the event.
  console.log("Reading options from event:\n", util.inspect(event, {depth: 5}));
  
  var srcBucket = event.bucket
  var dstBucket = srcBucket;
  var srcKey = event.srcKey;
  var dstKey = event.dstKey;

  // Infer the image type.
  var typeMatch = srcKey.match(/\.([^.]*)$/);
  if (!typeMatch) {
    console.error('unable to infer image type for key ' + srcKey);
    return;
  }
  var imageType = typeMatch[1];
  if (imageType != "jpg") {
    console.error('skipping non-image ' + srcKey);
    return;
  }

  console.log('start');
  var processStart = Date.now();
  var orientation = null;

  async.waterfall([
    function download(done) {
      // Download the image from S3 into a buffer.
      console.log('download:', srcKey);
      s3.getObject({
        Bucket: srcBucket,
        Key: srcKey
      }, function(err, data) {
        console.log('downloaded');
        if (err) {
          done(err);
        } else {
          // Inspecting EXIF tags
          inkjet.exif(data.Body, function(err, metadata) {
            // metadata -- an object that map EXIF tags to string value
            if (err) {
              done(err);
            } else {
              //console.log('EXIF tags', metadata); // All metadata
              console.log('EXIF tags(Orientation)', metadata["Orientation"]);
              if (metadata["Orientation"]) {
                orientation = metadata["Orientation"]["value"] 
              }

              done(null, data);
            }
          });
        }
      });
    },
    function resize_and_upload(response, done) {
      console.log('resize_and_upload');
      console.log("file size:", response.Body.length);

      async.waterfall([
        // resize
        function transform(done) {
          console.log('rotating and resizing...');
          gm(response.Body).size(function(err, size) {
            var pic_width = size.width;
            var pic_height = size.height;
            console.log('width=', pic_width);
            console.log('height=', pic_height);

            var target_width, target_height;

            if (orientation && orientation >= 5) {
              // See http://dqn.sakusakutto.jp/2009/02/jpegexiforientaion.html
              //     http://qiita.com/minodisk/items/b7bab1b3f351f72d534b
              console.log('input width(rotated)=', pic_height);
              console.log('input height(rotated)=', pic_width);
              target_width = pic_height / 2;
              target_height = pic_width / 2;
              console.log("target_width=", target_width, "target_height=", target_height);
            } else {
              console.log('input width(rotated)=', pic_width);
              console.log('input height(rotated)=', pic_height);
              target_width = pic_width / 2;
              target_height = pic_height / 2;
              console.log("target_width=", target_width, "target_height=", target_height);
            }

            // Transform the image buffer in memory.
            this.autoOrient()
            .resize(target_width, target_height)
            .density(72, 72)
            .quality(95)
            .toBuffer(imageType, function(err, buffer) {
              if (err) {
                done(err);
              } else {
                console.log('resize and auto rotation done.');
                done(null, response.ContentType, buffer);
              }
            });
          });
        },
        // upload
        function upload(contentType, data, done) {
          // Stream the transformed image to a different directory.
          console.log('uploading to', dstKey);
          s3.putObject({
            Bucket: dstBucket,
            Key: dstKey,
            Body: data,
            ContentType: contentType
          }, function(err, resp) {
            if (err) {
              console.error(err);
              done(err);
            }
            console.log("uploaded.");
            done(null, resp);
          });
        },
      ], function (err, result) {
        if (err) console.error(err);
        done(err);
      });
    },
  ], function (err, result) {
    if (err) {
      console.error(err);
    } else {
      console.log("completed successfully");
    }

    context.done(err, Date.now() - processStart);
  });
}
