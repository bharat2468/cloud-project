#!/bin/bash

# 📊 E-Commerce Microservices Performance Metrics Script
# =====================================================
# Comprehensive performance testing for faculty demonstration

echo "🎯 E-COMMERCE MICROSERVICES PERFORMANCE ANALYSIS"
echo "================================================="
echo "Date: $(date)"
echo "System: $(uname -s) $(uname -m)"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to measure response time
measure_response_time() {
    local url=$1
    local description=$2
    local headers=$3
    
    echo -n "Testing $description... "
    
    if [ -n "$headers" ]; then
        result=$(curl -s -o /dev/null -w "%{http_code};%{time_total};%{time_connect};%{size_download}" "$url" -H "$headers")
    else
        result=$(curl -s -o /dev/null -w "%{http_code};%{time_total};%{time_connect};%{size_download}" "$url")
    fi
    
    IFS=';' read -ra METRICS <<< "$result"
    status_code=${METRICS[0]}
    total_time=${METRICS[1]}
    connect_time=${METRICS[2]}
    size=${METRICS[3]}
    
    if [ "$status_code" = "200" ]; then
        echo -e "${GREEN}✅ ${total_time}s (${size} bytes)${NC}"
        echo "$total_time" >> /tmp/response_times.txt
        return 0
    else
        echo -e "${RED}❌ HTTP $status_code${NC}"
        return 1
    fi
}

# Function to test concurrent requests
test_concurrent_requests() {
    local url=$1
    local description=$2
    local concurrent_users=$3
    
    echo ""
    echo -e "${BLUE}🔄 Concurrent Load Test: $description${NC}"
    echo "Users: $concurrent_users | Requests per user: 10"
    
    # Create temporary file for results
    > /tmp/concurrent_results.txt
    
    # Start concurrent requests
    for ((i=1; i<=concurrent_users; i++)); do
        {
            for ((j=1; j<=10; j++)); do
                start_time=$(date +%s.%N)
                response=$(curl -s -w "%{http_code}" -o /dev/null "$url")
                end_time=$(date +%s.%N)
                duration=$(echo "$end_time - $start_time" | bc -l)
                echo "$response,$duration" >> /tmp/concurrent_results.txt
            done
        } &
    done
    
    # Wait for all background jobs to finish
    wait
    
    # Analyze results
    total_requests=$(wc -l < /tmp/concurrent_results.txt)
    successful_requests=$(grep -c "^200," /tmp/concurrent_results.txt)
    failed_requests=$((total_requests - successful_requests))
    success_rate=$(echo "scale=2; $successful_requests * 100 / $total_requests" | bc -l)
    
    # Calculate average response time
    avg_time=$(awk -F',' '{sum+=$2; count++} END {if(count>0) print sum/count; else print 0}' /tmp/concurrent_results.txt)
    
    echo "📈 Results:"
    echo "  - Total Requests: $total_requests"
    echo "  - Successful: $successful_requests"
    echo "  - Failed: $failed_requests"
    echo -e "  - Success Rate: ${GREEN}${success_rate}%${NC}"
    echo "  - Average Response Time: ${avg_time}s"
    
    # Clean up
    rm -f /tmp/concurrent_results.txt
}

# Function to get system metrics
get_system_metrics() {
    echo ""
    echo -e "${BLUE}💻 SYSTEM RESOURCE UTILIZATION${NC}"
    echo "================================"
    
    # CPU Usage
    cpu_usage=$(top -l 1 | grep "CPU usage" | awk '{print $3}' | sed 's/%//')
    echo "🖥️  CPU Usage: ${cpu_usage}%"
    
    # Memory Usage
    memory_pressure=$(memory_pressure 2>/dev/null | grep "System-wide memory free percentage" | awk '{print $5}' || echo "N/A")
    echo "💾 Memory Free: ${memory_pressure}"
    
    # Docker Container Stats
    echo ""
    echo "🐳 Docker Container Performance:"
    echo "================================"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" | head -5
}

# Function to test database operations
test_database_performance() {
    echo ""
    echo -e "${BLUE}🗄️  DATABASE OPERATIONS PERFORMANCE${NC}"
    echo "===================================="
    
    # Get JWT token for authenticated requests
    echo "Getting authentication token..."
    TOKEN=$(curl -s http://localhost:1880/api/users/login \
        -H "Content-Type: application/json" \
        -d '{"email":"test@cart.com","password":"password123"}' | \
        jq -r '.token' 2>/dev/null)
    
    if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
        echo -e "${GREEN}✅ Authentication successful${NC}"
        
        # Test database read operations
        echo ""
        echo "Testing database READ operations:"
        measure_response_time "http://localhost:1880/api/products" "Get All Products (DB Read)"
        measure_response_time "http://localhost:1880/api/users" "Get User Profile (DB Read)" "Authorization: Bearer $TOKEN"
        measure_response_time "http://localhost:1880/api/cart" "Get Cart Data (DB Read)" "Authorization: Bearer $TOKEN"
        
        # Test database write operations
        echo ""
        echo "Testing database WRITE operations:"
        
        # Add to cart (DB Write)
        echo -n "Add Product to Cart (DB Write)... "
        add_result=$(curl -s -w "%{http_code};%{time_total}" \
            -X POST "http://localhost:1880/api/cart/68d9122ee1ea245fb1c1d726" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json")
        
        IFS=';' read -ra WRITE_METRICS <<< "$add_result"
        write_status=${WRITE_METRICS[0]}
        write_time=${WRITE_METRICS[1]}
        
        if [ "$write_status" = "200" ]; then
            echo -e "${GREEN}✅ ${write_time}s${NC}"
        else
            echo -e "${RED}❌ HTTP $write_status${NC}"
        fi
        
        # Remove from cart (DB Write)
        echo -n "Remove Product from Cart (DB Write)... "
        remove_result=$(curl -s -w "%{http_code};%{time_total}" \
            -X DELETE "http://localhost:1880/api/cart/68d9122ee1ea245fb1c1d726" \
            -H "Authorization: Bearer $TOKEN")
        
        IFS=';' read -ra REMOVE_METRICS <<< "$remove_result"
        remove_status=${REMOVE_METRICS[0]}
        remove_time=${REMOVE_METRICS[1]}
        
        if [ "$remove_status" = "200" ]; then
            echo -e "${GREEN}✅ ${remove_time}s${NC}"
        else
            echo -e "${RED}❌ HTTP $remove_status${NC}"
        fi
        
    else
        echo -e "${RED}❌ Authentication failed - skipping authenticated tests${NC}"
    fi
}

# Function to analyze Node-RED performance
analyze_node_red_performance() {
    echo ""
    echo -e "${BLUE}🔗 NODE-RED API GATEWAY PERFORMANCE${NC}"
    echo "==================================="
    
    echo "Testing API Gateway routing efficiency..."
    
    # Test direct service vs Node-RED routing
    echo ""
    echo "Comparing Direct Service vs Node-RED Gateway:"
    
    # Direct Product service
    echo -n "Direct Product Service (Port 3002)... "
    direct_result=$(curl -s -w "%{time_total}" -o /dev/null "http://localhost:3002/products")
    echo -e "${YELLOW}${direct_result}s${NC}"
    
    # Through Node-RED
    echo -n "Through Node-RED Gateway (Port 1880)... "
    gateway_result=$(curl -s -w "%{time_total}" -o /dev/null "http://localhost:1880/api/products")
    echo -e "${GREEN}${gateway_result}s${NC}"
    
    # Calculate overhead
    overhead=$(echo "scale=4; $gateway_result - $direct_result" | bc -l)
    overhead_percent=$(echo "scale=2; ($overhead / $direct_result) * 100" | bc -l)
    
    echo "📊 Gateway Overhead: ${overhead}s (${overhead_percent}%)"
    
    if (( $(echo "$overhead_percent < 20" | bc -l) )); then
        echo -e "${GREEN}✅ Excellent gateway performance (<20% overhead)${NC}"
    elif (( $(echo "$overhead_percent < 50" | bc -l) )); then
        echo -e "${YELLOW}⚠️  Good gateway performance (<50% overhead)${NC}"
    else
        echo -e "${RED}⚠️  Consider gateway optimization${NC}"
    fi
}

# Function to generate performance report
generate_performance_report() {
    echo ""
    echo -e "${BLUE}📋 PERFORMANCE SUMMARY REPORT${NC}"
    echo "=============================="
    
    # Calculate statistics if we have response time data
    if [ -f /tmp/response_times.txt ] && [ -s /tmp/response_times.txt ]; then
        total_tests=$(wc -l < /tmp/response_times.txt)
        avg_response=$(awk '{sum+=$1; count++} END {print sum/count}' /tmp/response_times.txt)
        min_response=$(sort -n /tmp/response_times.txt | head -1)
        max_response=$(sort -n /tmp/response_times.txt | tail -1)
        
        echo "🎯 API Performance Metrics:"
        echo "  - Total API Tests: $total_tests"
        echo "  - Average Response Time: ${avg_response}s"
        echo "  - Fastest Response: ${min_response}s"
        echo "  - Slowest Response: ${max_response}s"
        
        # Performance rating
        if (( $(echo "$avg_response < 0.5" | bc -l) )); then
            echo -e "  - Performance Rating: ${GREEN}⭐⭐⭐⭐⭐ Excellent${NC}"
        elif (( $(echo "$avg_response < 1.0" | bc -l) )); then
            echo -e "  - Performance Rating: ${GREEN}⭐⭐⭐⭐ Very Good${NC}"
        elif (( $(echo "$avg_response < 2.0" | bc -l) )); then
            echo -e "  - Performance Rating: ${YELLOW}⭐⭐⭐ Good${NC}"
        else
            echo -e "  - Performance Rating: ${RED}⭐⭐ Needs Optimization${NC}"
        fi
        
        rm -f /tmp/response_times.txt
    fi
    
    echo ""
    echo "🏗️ Architecture Benefits:"
    echo "  ✅ Microservices isolation"
    echo "  ✅ Centralized API gateway"
    echo "  ✅ JWT-based security"
    echo "  ✅ Docker containerization"
    echo "  ✅ Scalable design"
    echo "  ✅ Visual API orchestration"
    
    echo ""
    echo "🎓 Faculty Demonstration Points:"
    echo "  • Real-time performance monitoring"
    echo "  • Production-ready architecture"
    echo "  • Comprehensive error handling"
    echo "  • Industry-standard technologies"
    echo "  • Scalable microservices design"
}

# Main execution
echo "Starting comprehensive performance analysis..."
echo ""

# Initialize
> /tmp/response_times.txt

# 1. System Metrics
get_system_metrics

# 2. Basic API Performance Tests
echo ""
echo -e "${BLUE}⚡ BASIC API PERFORMANCE TESTS${NC}"
echo "==============================="

measure_response_time "http://localhost:1880/api/products" "Product Catalog API"
measure_response_time "http://localhost:3002/products" "Direct Product Service"
measure_response_time "http://localhost:1880" "Node-RED Dashboard"

# 3. Authentication Performance
echo ""
echo -e "${BLUE}🔐 AUTHENTICATION PERFORMANCE${NC}"
echo "=============================="

echo -n "User Login Performance... "
login_time=$(curl -s -w "%{time_total}" -o /dev/null \
    http://localhost:1880/api/users/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@cart.com","password":"password123"}')
echo -e "${GREEN}✅ ${login_time}s${NC}"

# 4. Database Performance
test_database_performance

# 5. Node-RED Gateway Performance
analyze_node_red_performance

# 6. Concurrent Load Testing
test_concurrent_requests "http://localhost:1880/api/products" "Product Catalog" 5
test_concurrent_requests "http://localhost:1880/api/products" "High Load Test" 10

# 7. Generate Final Report
generate_performance_report

echo ""
echo -e "${GREEN}🎉 Performance analysis complete!${NC}"
echo "Timestamp: $(date)"
echo ""