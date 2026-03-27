When you are handling cors on the aws lambda side, you could deactivate the CORS in the
function config tab.
aws s3 sync ./dist s3://perezlab.co

If you want to delete files in S3 that no longer exist locally:

aws s3 sync ./my-project s3://my-bucket-name --delete

For a static site deployment, people often run:

aws s3 sync ./dist s3://perezlab.co --delete
