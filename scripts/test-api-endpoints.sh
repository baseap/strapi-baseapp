#!/bin/bash

# test-api-endpoints.sh
# 
# Tests all Strapi CMS API endpoints to verify they're working correctly.
# Tests both local (localhost:1337) and cloud (strapiapp.com) instances.
#
# Usage:
#   ./scripts/test-api-endpoints.sh [local|cloud]
#   Default: local (assumes Strapi dev server running)

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENV="${1:-local}"

if [ "$ENV" = "local" ]; then
  BASE_URL="http://localhost:1337/api"
  echo -e "${BLUE}🧪 Testing LOCAL Strapi instance${NC}"
  echo -e "Base URL: ${BASE_URL}\n"
elif [ "$ENV" = "cloud" ]; then
  BASE_URL="https://positive-acoustics-345fa51dc4.strapiapp.com/api"
  echo -e "${BLUE}🧪 Testing CLOUD Strapi instance${NC}"
  echo -e "Base URL: ${BASE_URL}\n"
else
  echo -e "${RED}Usage: ./scripts/test-api-endpoints.sh [local|cloud]${NC}"
  exit 1
fi

# Track results
PASSED=0
FAILED=0

# Test function
test_endpoint() {
  local name=$1
  local endpoint=$2
  local method=${3:-GET}
  
  echo -n "Testing $name... "
  
  response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint")
  http_code=$(echo "$response" | tail -n 1)
  body=$(echo "$response" | head -n -1)
  
  if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
    echo -e "${GREEN}✓ ($http_code)${NC}"
    PASSED=$((PASSED + 1))
    
    # Show count if available
    count=$(echo "$body" | grep -o '"id"' | wc -l || echo "")
    if [ -n "$count" ] && [ "$count" -gt 0 ]; then
      echo "  Found $count items"
    fi
  else
    echo -e "${RED}✗ ($http_code)${NC}"
    FAILED=$((FAILED + 1))
    echo "  Response: ${body:0:100}..."
  fi
}

# Test all endpoints
echo -e "${YELLOW}📋 Collection Endpoints${NC}"
test_endpoint "Premium Categories" "/premium-categories?populate=*"
test_endpoint "Training Categories" "/training-categories?populate=*"
test_endpoint "Training Partners" "/training-partners?populate=*"
test_endpoint "Instructors" "/instructors?populate=*"
test_endpoint "Vendors" "/vendors?populate=*"
test_endpoint "Content Creators" "/content-creators?populate=*"
test_endpoint "Premium Content" "/premium-contents?populate=*"
test_endpoint "Training Tracks" "/training-tracks?populate=*"
test_endpoint "Training Sessions" "/training-sessions?populate=*"
test_endpoint "Tags" "/tags?populate=*"

echo ""
echo -e "${YELLOW}🔍 Filtered Queries${NC}"
test_endpoint "Premium Categories (active)" "/premium-categories?filters[is_active][\$eq]=true"
test_endpoint "Training Tracks (cultural)" "/training-tracks?filters[applicable_launchpad_tracks][\$contains]=cultural_experience"
test_endpoint "Training Partners (active)" "/training-partners?filters[is_active][\$eq]=true"
test_endpoint "Vendors (certified)" "/vendors?filters[training_status][\$eq]=certified"

echo ""
echo -e "${YELLOW}📄 Pagination Tests${NC}"
test_endpoint "Premium Content (page 1)" "/premium-contents?pagination[page]=1&pagination[pageSize]=10"
test_endpoint "Training Tracks (limited)" "/training-tracks?pagination[pageSize]=5"

echo ""
echo -e "${YELLOW}📊 Results${NC}"
echo -e "${GREEN}Passed: $PASSED${NC}"
if [ $FAILED -gt 0 ]; then
  echo -e "${RED}Failed: $FAILED${NC}"
else
  echo -e "Failed: 0"
fi

echo ""
if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✨ All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ Some tests failed${NC}"
  exit 1
fi
