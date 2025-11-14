#!/bin/bash

# Script to validate that git user email matches corporate domain
CORPORATE_DOMAIN="verifty.com"
USER_EMAIL=$(git config user.email)

if [[ ! "$USER_EMAIL" =~ @${CORPORATE_DOMAIN}$ ]]; then
    echo "Error: Git user email must be a @${CORPORATE_DOMAIN} address"
    echo "Current email: $USER_EMAIL"
    echo ""
    echo "Please set your email with:"
    echo "  git config user.email your.name@${CORPORATE_DOMAIN}"
    exit 1
fi

echo "Email validation passed: $USER_EMAIL"
exit 0
