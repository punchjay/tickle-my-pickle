---
name: maps-billing-safeguards
description: GCP project/billing IDs and the gcloud commands for the Google Maps API daily quota caps and $1 budget alert. Use when adjusting Maps quotas or the budget, investigating OVER_QUERY_LIMIT errors, or checking Maps API spend.
---

# Maps billing & quota safeguards

The Maps key lives in GCP project **`project-6f338a57-964a-40ff-b35`** (project number `718145742726`), billing account **`01071C-F88769-A0BD5A`**. Maps APIs bill the card automatically past the monthly free tier — Google does **not** warn or stop on its own — so two safeguards are in place (managed via `gcloud`, not in this repo):

- **Daily quota caps — the hard ceiling.** Each used API is capped per day; past it, requests fail with `OVER_QUERY_LIMIT` instead of billing (resets midnight Pacific). Currently **1,000/day** on each of: `maps-backend.googleapis.com/billable_default` (Map loads), `geocoding-backend.googleapis.com/billable_default` (v3 geocoding), `places.googleapis.com/SearchTextRequest`. Adjust: `gcloud alpha services quota update --service=<svc> --consumer=projects/project-6f338a57-964a-40ff-b35 --metric=<metric> --unit="1/d/{project}" --value=<n> --force` (needs the `alpha` component).
- **Budget alert — early warning email.** A $1 budget named **"Maps API tripwire ($1)"** (`gcloud billing budgets`, requires `billingbudgets.googleapis.com` enabled) emails the billing admins at 50/90/100% of actual spend + forecasted 100%. Since normal usage sits at $0 in the free tier, the 50% ($0.50) alert is effectively a "you've started paying" tripwire. It only warns; it does not stop usage (that's what the quota caps are for).
