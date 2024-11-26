#!/usr/bin/env bash
# awslocal s3 mb s3://comfyui-deploy
awslocal s3api create-bucket --bucket comfyui-deploy --create-bucket-configuration LocationConstraint=ap-northeast-1
awslocal s3api put-bucket-cors --bucket comfyui-deploy  --cors-configuration file:///app/web/aws/cors-config.json