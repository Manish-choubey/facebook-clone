Features
Signup and signin authentication
Forgot password and reset password
Change password when logged in
Create, read, update and delete posts
Post reactions
Comments
Followers, following, block and unblock
Private chat messaging with text, images, gifs, and reactions
Image upload
In-app notification and email notification
Main tools
Node.js
Typescript
MongoDB
Mongoose
Redis
Express
Bull
PM2
AWS
Terraform
Nodemailer
Sendgrid mail
Cloudinary
Jest
Lodash
Socket.io



AWS Setup
You can create an account on AWS if you don't have one already.
Download and install aws cli.
On AWS, create an IAM user. You'll get a key and secret.
Use aws configure command to add your iam secret and key to your local machine.
To deploy the backend server on AWS, it is required you have a domain to use.
With that domain, manually create a route53 hosted zone on AWS.



AWS Resources Used
VPC
Subnets
Internet gateways
Route tables
Elastic ips
Nat gateways
Security groups
ALB target groups
Route53
AWS Certificate Manager
Application load balancers
IAM roles
Elasticache
EC2 launch config
EC2 instances
Autoscaling group
S3
Code deploy
Cloudwatch




AWS Infrastructure Setup with Terraform
Make sure to uncomment this line sameSite: 'none' inside setupServer.ts file.
Install terraform
Terraform stores state about your managed infrastructure and configuration. This state is used by Terraform to map real world resources to your configuration, keep track of metadata, and to improve performance for large infrastructures.
This state is stored by default in a local file named "terraform.tfstate", but it can also be stored remotely, which works better in a team environment.
Update the variables.tf file with the correct data. Update the properties with comments.
To store your terraform remote state on AWS, first create a unique S3 bucket with a sub-folder name called develop.
Add that S3 bucket name to main.tf file. Also add your region to the file.
Create a keyPair on AWS. Keep the key safe on your local machine and add the name of the keyPair to ec2_launch_config.tf and bastion_hosts.tf files.
Before running the terraform apply command to your resources, you need to
create a new s3 bucket to store env files
inside the created s3 bucket, add a sub-folder called backend and inside the backend folder another sub-folder called develop. Bucket path should be something like <your-s3-bucket>/backend/develop
in your project, create a .env.develop file. Add the contents of .env to the new file.
the contents of .env.develop needs to be properties that will be used when deployed
DATABASE_URL should be an actual mongodb url. You can create an account on mongodb atlas and create a new database.
NODE_ENV can be set to production
CLIENT_URL can be set to the frontend application local url or actual domain
API_URL should be https://api.dev.<your-backend-domain> that you specified inside your terraform variables.tf file.
SENDGRID_API_KEY and SENDGRID_SENDER should be created from sendgrid dashboard. Create an account.
after updating the .env.develop file, you can zip it and upload it to the new s3 bucket you created to store env files. Upload using aws cli
zip env-file.zip .env.develop. The file must be called env-file.zip.
aws --region <your-region> s3 cp env-file.zip s3://<your-s3-bucket>/backend/develop/
Go into the user-data.sh and update-env-file.sh files and update.
Once the env-file.zip has been added to your s3 bucket, you can execute inside the deployment folder, the commands:
terraform init
terraform validate
terraform fmt
terraform plan
terraform apply -auto-approve
It will take sometime to create the resources. If everything works well, you should be able to access the backend dev api endpoints.
To destroy all created resources, run
terraform destroy



Setup CI/CD Pipeline with CircleCI
Create an account on circleci.
Signup or login with the github or bitbucket account where you stored your code.
Setup your project.
Add the environment variables you see on the screenshot to circleci.