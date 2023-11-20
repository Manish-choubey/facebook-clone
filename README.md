# Project Name

A brief description of the project.

## Table of Contents

- [Features](#features)
- [Main Tools](#main-tools)
- [AWS Setup](#aws-setup)
- [AWS Resources Used](#aws-resources-used)
- [AWS Infrastructure Setup with Terraform](#aws-infrastructure-setup-with-terraform)
- [Setup CI/CD Pipeline with CircleCI](#setup-cicd-pipeline-with-circleci)

## Features

- Signup and signin authentication
- Forgot password and reset password
- Change password when logged in
- Create, read, update and delete posts
- Post reactions
- Comments
- Followers, following, block and unblock
- Private chat messaging with text, images, gifs, and reactions
- Image upload
- In-app notification and email notification

## Main Tools

- Node.js
- Typescript
- MongoDB
- Mongoose
- Redis
- Express
- Bull
- PM2
- AWS
- Terraform
- Nodemailer
- Sendgrid mail
- Cloudinary
- Jest
- Lodash
- Socket.io
- React js
- redux toolkit

## AWS Setup

1. Create an AWS account if not done already.
2. Download and install AWS CLI.
3. Create an IAM user on AWS and obtain key and secret.
4. Use `aws configure` to set up IAM user credentials on your local machine.
5. Manually create a Route53 hosted zone on AWS using your domain.

## AWS Resources Used

List of AWS resources used in your project.

## AWS Infrastructure Setup with Terraform

1. Uncomment the line `sameSite: 'none'` inside `setupServer.ts` file.
2. Install Terraform.
3. Update `variables.tf` file with the correct data.
4. Create a unique S3 bucket for remote Terraform state.
5. Update the S3 bucket name and region in `main.tf` file.
6. Create an AWS keyPair and update relevant files.
7. Create a new S3 bucket for env files and upload `.env.develop` file.
8. Update `user-data.sh` and `update-env-file.sh` files.
9. Run Terraform commands: `terraform init`, `terraform validate`, `terraform fmt`, `terraform plan`, `terraform apply -auto-approve`.

## Setup CI/CD Pipeline with CircleCI

1. Create an account on CircleCI.
2. Signup or login with your GitHub/Bitbucket account.
3. Setup your project on CircleCI.
4. Add the environment variables mentioned in the screenshot to CircleCI.

