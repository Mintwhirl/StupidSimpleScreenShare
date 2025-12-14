#!/bin/bash
echo "Adding Pusher environment variables..."
# These need to be replaced with actual values from Pusher dashboard
vercel env add VITE_PUSHER_KEY production
vercel env add VITE_PUSHER_CLUSTER production  
vercel env add PUSHER_APP_ID production
vercel env add PUSHER_KEY production
vercel env add PUSHER_SECRET production
vercel env add PUSHER_CLUSTER production
