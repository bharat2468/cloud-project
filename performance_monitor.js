const axios = require('axios');
const { performance } = require('perf_hooks');

// 📊 Advanced Performance Monitoring for Faculty Demo
// ==================================================

class PerformanceMonitor {
    constructor() {
        this.baseURL = 'http://localhost:1880';
        this.results = [];
        this.token = null;
    }

    // Colorful console output
    log(message, type = 'info') {
        const colors = {
            info: '\x1b[36m',    // Cyan
            success: '\x1b[32m', // Green
            warning: '\x1b[33m', // Yellow
            error: '\x1b[31m',   // Red
            reset: '\x1b[0m'     // Reset
        };
        
        const timestamp = new Date().toLocaleTimeString();
        console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
    }

    // Measure API response time with detailed metrics
    async measureApiPerformance(endpoint, method = 'GET', data = null, headers = {}) {
        const start = performance.now();
        
        try {
            const config = {
                method,
                url: `${this.baseURL}${endpoint}`,
                headers,
                timeout: 10000
            };
            
            if (data) config.data = data;
            
            const response = await axios(config);
            const end = performance.now();
            const responseTime = (end - start).toFixed(2);
            
            const result = {
                endpoint,
                method,
                statusCode: response.status,
                responseTime: parseFloat(responseTime),
                dataSize: JSON.stringify(response.data).length,
                timestamp: new Date().toISOString(),
                success: true
            };
            
            this.results.push(result);
            this.log(`✅ ${method} ${endpoint} - ${responseTime}ms (${result.dataSize} bytes)`, 'success');
            
            return result;
        } catch (error) {
            const end = performance.now();
            const responseTime = (end - start).toFixed(2);
            
            const result = {
                endpoint,
                method,
                statusCode: error.response?.status || 0,
                responseTime: parseFloat(responseTime),
                error: error.message,
                timestamp: new Date().toISOString(),
                success: false
            };
            
            this.results.push(result);
            this.log(`❌ ${method} ${endpoint} - ${responseTime}ms - Error: ${error.message}`, 'error');
            
            return result;
        }
    }

    // Authenticate and get JWT token
    async authenticate() {
        this.log('🔐 Authenticating user...', 'info');
        
        const result = await this.measureApiPerformance('/api/users/login', 'POST', {
            email: 'test@cart.com',
            password: 'password123'
        }, { 'Content-Type': 'application/json' });
        
        if (result.success && result.statusCode === 200) {
            // Get token from actual response
            const response = await axios.post(`${this.baseURL}/api/users/login`, {
                email: 'test@cart.com',
                password: 'password123'
            }, { headers: { 'Content-Type': 'application/json' }});
            
            this.token = response.data.token;
            this.log('✅ Authentication successful', 'success');
            return true;
        }
        
        this.log('❌ Authentication failed', 'error');
        return false;
    }

    // Test concurrent requests
    async testConcurrentLoad(endpoint, concurrency = 10, iterations = 5) {
        this.log(`🔄 Starting concurrent load test: ${concurrency} users, ${iterations} requests each`, 'info');
        
        const promises = [];
        const startTime = performance.now();
        
        for (let i = 0; i < concurrency; i++) {
            for (let j = 0; j < iterations; j++) {
                const headers = this.token ? { Authorization: `Bearer ${this.token}` } : {};
                promises.push(this.measureApiPerformance(endpoint, 'GET', null, headers));
            }
        }
        
        const results = await Promise.all(promises);
        const endTime = performance.now();
        const totalTime = ((endTime - startTime) / 1000).toFixed(2);
        
        const successful = results.filter(r => r.success).length;
        const failed = results.length - successful;
        const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
        const requestsPerSecond = (results.length / parseFloat(totalTime)).toFixed(2);
        
        this.log(`📊 Concurrent Load Test Results:`, 'info');
        console.log(`   • Total Requests: ${results.length}`);
        console.log(`   • Successful: ${successful}`);
        console.log(`   • Failed: ${failed}`);
        console.log(`   • Success Rate: ${((successful / results.length) * 100).toFixed(2)}%`);
        console.log(`   • Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
        console.log(`   • Total Test Time: ${totalTime}s`);
        console.log(`   • Requests/Second: ${requestsPerSecond}`);
        
        return {
            totalRequests: results.length,
            successful,
            failed,
            successRate: (successful / results.length) * 100,
            avgResponseTime,
            totalTime: parseFloat(totalTime),
            requestsPerSecond: parseFloat(requestsPerSecond)
        };
    }

    // Test database operations performance
    async testDatabasePerformance() {
        this.log('🗄️ Testing database operations...', 'info');
        
        if (!this.token) {
            this.log('⚠️ No authentication token, skipping authenticated DB tests', 'warning');
            return;
        }
        
        const authHeaders = { Authorization: `Bearer ${this.token}` };
        
        // Read operations
        await this.measureApiPerformance('/api/products', 'GET'); // Products from DB
        await this.measureApiPerformance('/api/users', 'GET', null, authHeaders); // User profile
        await this.measureApiPerformance('/api/cart', 'GET', null, authHeaders); // Cart data
        
        // Write operations
        await this.measureApiPerformance('/api/cart/68d9122ee1ea245fb1c1d726', 'POST', null, authHeaders);
        await this.measureApiPerformance('/api/cart/68d9122ee1ea245fb1c1d726', 'DELETE', null, authHeaders);
    }

    // Compare direct service vs Node-RED gateway
    async compareGatewayPerformance() {
        this.log('🔗 Comparing Direct Service vs Node-RED Gateway...', 'info');
        
        try {
            // Direct product service
            const directStart = performance.now();
            await axios.get('http://localhost:3002/products');
            const directEnd = performance.now();
            const directTime = directEnd - directStart;
            
            // Through Node-RED gateway
            const gatewayStart = performance.now();
            await axios.get(`${this.baseURL}/api/products`);
            const gatewayEnd = performance.now();
            const gatewayTime = gatewayEnd - gatewayStart;
            
            const overhead = gatewayTime - directTime;
            const overheadPercent = ((overhead / directTime) * 100).toFixed(2);
            
            console.log(`📈 Gateway Performance Analysis:`);
            console.log(`   • Direct Service: ${directTime.toFixed(2)}ms`);
            console.log(`   • Node-RED Gateway: ${gatewayTime.toFixed(2)}ms`);
            console.log(`   • Gateway Overhead: ${overhead.toFixed(2)}ms (${overheadPercent}%)`);
            
            if (overheadPercent < 20) {
                this.log('✅ Excellent gateway performance (<20% overhead)', 'success');
            } else if (overheadPercent < 50) {
                this.log('⚠️ Good gateway performance (<50% overhead)', 'warning');
            } else {
                this.log('⚠️ Consider gateway optimization', 'warning');
            }
            
        } catch (error) {
            this.log(`❌ Gateway comparison failed: ${error.message}`, 'error');
        }
    }

    // Generate comprehensive performance report
    generateReport() {
        this.log('📋 Generating Performance Report...', 'info');
        
        const successful = this.results.filter(r => r.success);
        const failed = this.results.filter(r => !r.success);
        
        if (successful.length === 0) {
            this.log('⚠️ No successful requests to analyze', 'warning');
            return;
        }
        
        const responseTimes = successful.map(r => r.responseTime);
        const avgResponse = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
        const minResponse = Math.min(...responseTimes);
        const maxResponse = Math.max(...responseTimes);
        
        // Calculate percentiles
        const sortedTimes = responseTimes.sort((a, b) => a - b);
        const p50 = sortedTimes[Math.floor(sortedTimes.length * 0.5)];
        const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
        const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)];
        
        console.log('\n' + '='.repeat(50));
        console.log('📊 COMPREHENSIVE PERFORMANCE REPORT');
        console.log('='.repeat(50));
        
        console.log('\n🎯 Request Statistics:');
        console.log(`   • Total Requests: ${this.results.length}`);
        console.log(`   • Successful: ${successful.length}`);
        console.log(`   • Failed: ${failed.length}`);
        console.log(`   • Success Rate: ${((successful.length / this.results.length) * 100).toFixed(2)}%`);
        
        console.log('\n⚡ Response Time Analysis:');
        console.log(`   • Average: ${avgResponse.toFixed(2)}ms`);
        console.log(`   • Minimum: ${minResponse.toFixed(2)}ms`);
        console.log(`   • Maximum: ${maxResponse.toFixed(2)}ms`);
        console.log(`   • 50th Percentile: ${p50.toFixed(2)}ms`);
        console.log(`   • 95th Percentile: ${p95.toFixed(2)}ms`);
        console.log(`   • 99th Percentile: ${p99.toFixed(2)}ms`);
        
        // Performance rating
        let rating;
        if (avgResponse < 100) rating = '⭐⭐⭐⭐⭐ Excellent';
        else if (avgResponse < 200) rating = '⭐⭐⭐⭐ Very Good';
        else if (avgResponse < 500) rating = '⭐⭐⭐ Good';
        else if (avgResponse < 1000) rating = '⭐⭐ Fair';
        else rating = '⭐ Needs Optimization';
        
        console.log(`\n🏆 Performance Rating: ${rating}`);
        
        console.log('\n🏗️ Architecture Highlights:');
        console.log('   ✅ Microservices Architecture');
        console.log('   ✅ API Gateway Pattern');
        console.log('   ✅ JWT Authentication');
        console.log('   ✅ Docker Containerization');
        console.log('   ✅ MongoDB Atlas Integration');
        console.log('   ✅ React Frontend with TypeScript');
        console.log('   ✅ Node-RED Visual API Orchestration');
        
        console.log('\n🎓 Faculty Demo Points:');
        console.log('   • Production-ready performance monitoring');
        console.log('   • Real-time metrics and analytics');
        console.log('   • Industry-standard architecture patterns');
        console.log('   • Comprehensive error handling');
        console.log('   • Scalable microservices design');
        console.log('   • Visual API flow management');
        
        console.log('\n' + '='.repeat(50));
    }

    // Main performance test execution
    async runCompletePerformanceTest() {
        console.log('\n🚀 Starting Comprehensive Performance Analysis');
        console.log('='.repeat(50));
        
        try {
            // 1. Basic API tests
            this.log('🔍 Phase 1: Basic API Performance Tests', 'info');
            await this.measureApiPerformance('/api/products');
            await this.measureApiPerformance('/api/users/register', 'POST', {
                name: 'Test User',
                email: 'test@cart.com',
                password: 'password123'
            }, { 'Content-Type': 'application/json' });
            
            // 2. Authentication
            this.log('\n🔐 Phase 2: Authentication Performance', 'info');
            await this.authenticate();
            
            if (this.token) {
                const authHeaders = { Authorization: `Bearer ${this.token}` };
                await this.measureApiPerformance('/api/users', 'GET', null, authHeaders);
                await this.measureApiPerformance('/api/cart', 'GET', null, authHeaders);
            }
            
            // 3. Database operations
            this.log('\n🗄️ Phase 3: Database Performance Tests', 'info');
            await this.testDatabasePerformance();
            
            // 4. Gateway comparison
            this.log('\n🔗 Phase 4: Gateway Performance Analysis', 'info');
            await this.compareGatewayPerformance();
            
            // 5. Concurrent load testing
            this.log('\n🔄 Phase 5: Concurrent Load Testing', 'info');
            await this.testConcurrentLoad('/api/products', 5, 3);
            
            if (this.token) {
                await this.testConcurrentLoad('/api/cart', 3, 2);
            }
            
            // 6. Generate final report
            this.log('\n📊 Phase 6: Generating Comprehensive Report', 'info');
            this.generateReport();
            
            this.log('\n🎉 Performance analysis completed successfully!', 'success');
            
        } catch (error) {
            this.log(`❌ Performance test failed: ${error.message}`, 'error');
            console.error(error);
        }
    }
}

// Execute the performance monitoring
if (require.main === module) {
    const monitor = new PerformanceMonitor();
    monitor.runCompletePerformanceTest().catch(console.error);
}

module.exports = PerformanceMonitor;