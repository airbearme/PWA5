#!/bin/bash

# Automated Stripe webhook creation
# Requires: STRIPE_SECRET_KEY environment variable

set -e

DOMAIN="airbear.me"
WEBHOOK_URL="https://${DOMAIN}/api/stripe/webhook"

if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo "❌ STRIPE_SECRET_KEY environment variable required"
    exit 1
fi

echo "💳 Setting up Stripe webhook..."

# Check if webhook already exists
existing=$(curl -s -X GET "https://api.stripe.com/v1/webhook_endpoints" \
    -u "${STRIPE_SECRET_KEY}:" \
    -G -d "limit=100" | jq -r ".data[] | select(.url == \"${WEBHOOK_URL}\") | .id" || echo "")

if [ -n "$existing" ]; then
    echo "✅ Webhook already exists: $existing"
    exit 0
fi

# Create webhook
response=$(curl -s -X POST "https://api.stripe.com/v1/webhook_endpoints" \
    -u "${STRIPE_SECRET_KEY}:" \
    -d "url=${WEBHOOK_URL}" \
    -d "enabled_events[]=checkout.session.completed" \
    -d "enabled_events[]=payment_intent.succeeded" \
    -d "enabled_events[]=payment_intent.payment_failed")

webhook_id=$(echo "$response" | jq -r '.id' 2>/dev/null || echo "")
secret=$(echo "$response" | jq -r '.secret' 2>/dev/null || echo "")

if [ -n "$webhook_id" ] && [ "$webhook_id" != "null" ]; then
    echo "✅ Webhook created: $webhook_id"
    echo ""
    echo "📝 Add this to Vercel environment variables:"
    echo "   STRIPE_WEBHOOK_SECRET=$secret"
else
    echo "❌ Failed to create webhook"
    echo "$response" | jq '.' 2>/dev/null || echo "$response"
    exit 1
fi






