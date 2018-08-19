#!/usr/bin/env bash

set -uex

TARGET_FILE=.env

echo "FACEBOOK_APP_ID=${FACEBOOK_APP_ID}" > ${TARGET_FILE}
echo "BRANCH_KEY=${BRANCH_KEY}" >> ${TARGET_FILE}
echo "CODE_PUSH_DEPLOYMENT_KEY=${CODE_PUSH_DEPLOYMENT_KEY}" >> ${TARGET_FILE}
echo "SENTRY_DSN=${SENTRY_DSN}" >> ${TARGET_FILE}
echo "SENTRY_ORG=${SENTRY_ORG}" >> ${TARGET_FILE}
echo "SENTRY_URL=${SENTRY_URL}" >> ${TARGET_FILE}
echo "SENTRY_PROJECT=${SENTRY_PROJECT}" >> ${TARGET_FILE}
echo "ENVIRONMENT=${ENVIRONMENT}" >> ${TARGET_FILE}
echo "UPLOAD_URL=${UPLOAD_URL}" >> ${TARGET_FILE}
echo "SEGMENT_IOS_WRITE_KEY=${SEGMENT_IOS_WRITE_KEY}" >> ${TARGET_FILE}
echo "SEGMENT_ANDROID_WRITE_KEY=${SEGMENT_ANDROID_WRITE_KEY}" >> ${TARGET_FILE}
echo "API_BASE_URL=${API_BASE_URL}" >> ${TARGET_FILE}
