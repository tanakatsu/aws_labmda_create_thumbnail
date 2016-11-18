from PIL import Image
import StringIO
import tempfile
import boto3
import time
import json

env = {}
with open('env.json') as f:
    env = json.load(f)

session = boto3.Session(aws_access_key_id=env['AWS_ACCESS_KEY_ID'], aws_secret_access_key=env['AWS_SECRET_ACCESS_KEY'], region_name=env['AWS_DEFAULT_REGION'])
s3 = session.resource('s3')

convert_image = {
    1: lambda img: img,
    2: lambda img: img.transpose(Image.FLIP_LEFT_RIGHT),
    3: lambda img: img.transpose(Image.ROTATE_180),
    4: lambda img: img.transpose(Image.FLIP_TOP_BOTTOM),
    5: lambda img: img.transpose(Image.FLIP_LEFT_RIGHT).transpose(Image.ROTATE_90),
    6: lambda img: img.transpose(Image.ROTATE_270),
    7: lambda img: img.transpose(Image.FLIP_LEFT_RIGHT).transpose(Image.ROTATE_270),
    8: lambda img: img.transpose(Image.ROTATE_90),
}


def lambda_handler(event, context):
    bucket = event['bucket']
    src_key = event['srcKey']
    dst_key = event['dstKey']
    start_time = time.time()

    print('event=', event)

    try:
        obj = s3.Object(bucket, src_key).get()
        body = obj['Body'].read()
        size = obj['ContentLength']
        print 'downloaded (%d bytes)' % size

        img = Image.open(StringIO.StringIO(body))
        exif = img._getexif()
        orientation = exif.get(0x112, 1)
        print "width=%d, height=%d" % (img.width, img.height)
        print 'orientation=', orientation

        rotated_img = convert_image[orientation](img)
        print 'rotated'

        if orientation >= 5:
            print "resized to %d x %d" % (img.height / 2, img.width / 2)
            resized_img = rotated_img.resize((img.height / 2, img.width / 2), resample=Image.LANCZOS)
            print 'input width(rotated)=', img.height
            print 'input height(rotated)=', img.width
        else:
            print "resized to %d x %d" % (img.width / 2, img.height / 2)
            resized_img = rotated_img.resize((img.width / 2, img.height / 2), resample=Image.LANCZOS)
            print 'input width(rotated)=', img.width
            print 'input height(rotated)=', img.height

        with tempfile.TemporaryFile() as output:
            resized_img.save(output, 'JPEG', quality=95, dpi=(72, 72), subsampling=0)  # subsampling 0=4:4:4, 1=4:2:2
            output.seek(0)
            s3.Object(bucket, dst_key).put(Body=output, ContentType='image/jpeg')
        print('uploaded')
        print('successful')
        print('elapsed time=', time.time() - start_time)
    except Exception as e:
        print(e)
        raise e
