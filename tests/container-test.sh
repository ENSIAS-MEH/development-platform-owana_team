#!/bin/bash
set -e

echo "=== Container Smoke Tests ==="

SERVICES=(
  "infrastructure/config-server:8888"
  "infrastructure/api-gateway:8080"
  "services/auth-service:8081"
  "services/user-service:8082"
  "services/startup-service:8083"
  "services/post-service:8084"
  "services/chat-service:8085"
  "services/notification-service:8086"
)

PASSED=0
FAILED=0

for SERVICE_PORT in "${SERVICES[@]}"; do
  SERVICE_PATH="${SERVICE_PORT%%:*}"
  PORT="${SERVICE_PORT##*:}"
  SERVICE_NAME=$(basename "$SERVICE_PATH")

  echo ""
  echo "--- Testing: $SERVICE_NAME (port $PORT) ---"

  # Build
  echo "  Building..."
  docker build -t "test-$SERVICE_NAME" "$SERVICE_PATH" > /dev/null 2>&1
  if [ $? -ne 0 ]; then
    echo "  ❌ BUILD FAILED"
    FAILED=$((FAILED + 1))
    continue
  fi
  echo "  ✅ Build OK"

  # Run container
  echo "  Starting container..."
  CONTAINER_ID=$(docker run -d --rm -p "$PORT:$PORT" "test-$SERVICE_NAME")

  # Wait for startup
  sleep 15

  # Health check
  echo "  Checking health..."
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/actuator/health" 2>/dev/null || echo "000")

  # Stop container
  docker stop "$CONTAINER_ID" > /dev/null 2>&1 || true

  if [ "$HTTP_CODE" = "200" ]; then
    echo "  ✅ Health check passed (HTTP $HTTP_CODE)"
    PASSED=$((PASSED + 1))
  else
    echo "  ❌ Health check failed (HTTP $HTTP_CODE)"
    FAILED=$((FAILED + 1))
  fi

  # Cleanup image
  docker rmi "test-$SERVICE_NAME" > /dev/null 2>&1 || true
done

# Frontend test
echo ""
echo "--- Testing: frontend (port 3000) ---"
docker build -t "test-frontend" "frontend/" > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "  ❌ BUILD FAILED"
  FAILED=$((FAILED + 1))
else
  echo "  ✅ Build OK"
  CONTAINER_ID=$(docker run -d --rm -p 3000:3000 "test-frontend")
  sleep 10
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000" 2>/dev/null || echo "000")
  docker stop "$CONTAINER_ID" > /dev/null 2>&1 || true
  docker rmi "test-frontend" > /dev/null 2>&1 || true
  if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "302" ]; then
    echo "  ✅ Health check passed (HTTP $HTTP_CODE)"
    PASSED=$((PASSED + 1))
  else
    echo "  ❌ Health check failed (HTTP $HTTP_CODE)"
    FAILED=$((FAILED + 1))
  fi
fi

echo ""
echo "=== Results: $PASSED passed, $FAILED failed ==="
exit $FAILED
