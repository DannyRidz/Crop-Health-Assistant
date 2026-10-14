#!/usr/bin/env bash
set -euo pipefail

# Run in Cloud Shell with private credential files after access approval.
# Keep screening paused while the cloud configuration is checked.
project_id=gen-lang-client-0276450924
region=asia-southeast1
service=coffee-health-demo
runtime_account=coffee-demo-runtime@gen-lang-client-0276450924.iam.gserviceaccount.com
key_file=${1:?Provide the private Gemini key file}
signing_file=${2:?Provide the private signing secret file}
test -s "$key_file"
test -s "$signing_file"

gcloud services enable secretmanager.googleapis.com --project="$project_id"
for secret_name in coffee-gemini-api-key coffee-session-signing-secret; do
  if ! gcloud secrets describe "$secret_name" --project="$project_id" >/dev/null 2>&1; then
    gcloud secrets create "$secret_name" --project="$project_id" --replication-policy=automatic --quiet
  fi
done
key_version=$(gcloud secrets versions add coffee-gemini-api-key --project="$project_id" --data-file="$key_file" --format='value(name)')
signing_version=$(gcloud secrets versions add coffee-session-signing-secret --project="$project_id" --data-file="$signing_file" --format='value(name)')
for secret_name in coffee-gemini-api-key coffee-session-signing-secret; do
  gcloud secrets add-iam-policy-binding "$secret_name" --project="$project_id" --member="serviceAccount:$runtime_account" --role=roles/secretmanager.secretAccessor --quiet >/dev/null
done

gcloud run services update "$service" --project="$project_id" --region="$region" \
  --update-secrets="GEMINI_API_KEY=coffee-gemini-api-key:${key_version##*/},SESSION_SIGNING_SECRET=coffee-session-signing-secret:${signing_version##*/}" \
  --update-env-vars=SCREENING_ENABLED=false,GEMINI_SERVICE_TIER=paid --quiet

# Delete only these temporary transport files after successful configuration.
rm -- "$key_file" "$signing_file"
printf 'Cloud credentials configured. Screening remains disabled.\n'
