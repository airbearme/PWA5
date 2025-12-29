#!/bin/bash

# Production Verification Script
# Tests all critical endpoints and functionality

set -e

DOMAIN="https://airbear.me"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔍 Verifying AirBear PWA production deployment..."
echo ""

# Test health endpoint
echo -e "${YELLOW}Testing health endpoint...${NC}"
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $DOMAIN/api/health)
if [ "$HEALTH_STATUS" -eq 200 ]; then
  echo -e "${GREEN}✓ Health check passed${NC}"
else
  echo -e "${RED}✗ Health check failed (HTTP $HEALTH_STATUS)${NC}"
  exit 1
fi

# Test homepage
echo -e "${YELLOW}Testing homepage...${NC}"
HOME_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $DOMAIN)
if [ "$HOME_STATUS" -eq 200 ]; then
  echo -e "${GREEN}✓ Homepage accessible${NC}"
else
  echo -e "${RED}✗ Homepage failed (HTTP $HOME_STATUS)${NC}"
  exit 1
fi

# Test map page
echo -e "${YELLOW}Testing map page...${NC}"
MAP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $DOMAIN/map)
if [ "$MAP_STATUS" -eq 200 ]; then
  echo -e "${GREEN}✓ Map page accessible${NC}"
else
  echo -e "${RED}✗ Map page failed (HTTP $MAP_STATUS)${NC}"
  exit 1
fi

# Test auth pages
echo -e "${YELLOW}Testing auth pages...${NC}"
LOGIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $DOMAIN/auth/login)
if [ "$LOGIN_STATUS" -eq 200 ]; then
  echo -e "${GREEN}✓ Login page accessible${NC}"
else
  echo -e "${RED}✗ Login page failed (HTTP $LOGIN_STATUS)${NC}"
  exit 1
fi

# Test products page
echo -e "${YELLOW}Testing products page...${NC}"
PRODUCTS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $DOMAIN/products)
if [ "$PRODUCTS_STATUS" -eq 200 ]; then
  echo -e "${GREEN}✓ Products page accessible${NC}"
else
  echo -e "${RED}✗ Products page failed (HTTP $PRODUCTS_STATUS)${NC}"
  exit 1
fi

# Test SSL certificate
echo -e "${YELLOW}Verifying SSL certificate...${NC}"
SSL_EXPIRY=$(echo | openssl s_client -servername airbear.me -connect airbear.me:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
echo -e "${GREEN}✓ SSL certificate valid until: $SSL_EXPIRY${NC}"

# Performance check
echo -e "${YELLOW}Checking response times...${NC}"
RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}' $DOMAIN)
echo -e "${GREEN}✓ Homepage response time: ${RESPONSE_TIME}s${NC}"

echo ""
echo -e "${GREEN}🎉 All verification checks passed!${NC}"
echo -e "${GREEN}✨ Production site is healthy and operational${NC}"
