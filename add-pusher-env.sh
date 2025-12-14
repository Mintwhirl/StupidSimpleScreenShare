#!/bin/bash
echo "Adding Pusher environment variables to Vercel..."
echo ""
echo "Please have your Pusher Dashboard ready with the following values:"
echo "- App ID"
echo "- Key"
echo "- Secret"
echo "- Cluster"
echo ""
echo "Press Enter to continue..."
read

echo ""
echo "Enter VITE_PUSHER_KEY (exposed to client):"
vercel env add VITE_PUSHER_KEY production

echo ""
echo "Enter VITE_PUSHER_CLUSTER (exposed to client):"
vercel env add VITE_PUSHER_CLUSTER production

echo ""
echo "Enter PUSHER_APP_ID:"
vercel env add PUSHER_APP_ID production

echo ""
echo "Enter PUSHER_KEY:"
vercel env add PUSHER_KEY production

echo ""
echo "Enter PUSHER_SECRET:"
vercel env add PUSHER_SECRET production

echo ""
echo "Enter PUSHER_CLUSTER:"
vercel env add PUSHER_CLUSTER production

echo ""
echo "Verifying environment variables:"
vercel env ls