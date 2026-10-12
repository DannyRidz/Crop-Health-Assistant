#!/usr/bin/env bash
set -euo pipefail

# Deploy only the public demonstration with screening disabled.
# Run from the repository root after resolving Cloud billing payment issues.
project_id=gen-lang-client-0276450924
region=asia-southeast1
service=coffee-health-demo
runtime_account=coffee-demo-runtime

command -v gcloud >/dev/null
test -f Dockerfile
test -f .gcloudignore
test "$(gcloud billing projects describe "$project_id" --format='value(billingEnabled)')" = True

gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com iam.googleapis.com --project="$project_id"
if ! gcloud iam service-accounts describe "$runtime_account@$project_id.iam.gserviceaccount.com" --project="$project_id" >/dev/null 2>&1; then
  gcloud iam service-accounts create "$runtime_account" --display-name='Coffee demonstration runtime' --project="$project_id"
fi
# This runtime account receives no project roles and no secret access yet.
# Source deployment needs the build account to have the Cloud Run builder role.
project_number=$(gcloud projects describe "$project_id" --format='value(projectNumber)')
gcloud projects add-iam-policy-binding "$project_id" --member="serviceAccount:$project_number-compute@developer.gserviceaccount.com" --role=roles/run.builder --condition=None --quiet

gcloud run deploy "$service" --project="$project_id" --region="$region" \
  --source=. --service-account="$runtime_account@$project_id.iam.gserviceaccount.com" \
  --allow-unauthenticated --ingress=all --min=0 --max=1 \
  --cpu=1 --memory=512Mi --concurrency=8 --timeout=60 --cpu-throttling \
  --no-cpu-boost --port=8080 \
  --set-env-vars=SCREENING_ENABLED=false,GEMINI_SERVICE_TIER=demo,TRUST_PROXY=false,NEXT_TELEMETRY_DISABLED=1 \
  --quiet

gcloud run services describe "$service" --project="$project_id" --region="$region" --format='value(status.url)'
