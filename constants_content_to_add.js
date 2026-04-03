// src/utils/constants.js - ADD THIS CONTENT TO DEFAULT_VOCAB AND DEFAULT_QUESTIONS ARRAYS

// ============= BACKEND VOCABULARY (100+ terms) =============
// Add these to DEFAULT_VOCAB array

export const BACKEND_VOCABULARY = [
  // Web Services & APIs
  {
    id: 151,
    term: 'RESTful API',
    meaning: 'Architectural style using HTTP methods (GET, POST, PUT, DELETE) to perform operations on resources',
    example: 'Our API: GET /api/users returns all users, POST /api/users creates new user with JSON body',
    category: 'backend',
    type: 'web-services',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id:   152,
    term: 'GraphQL',
    meaning: 'Query language for APIs allowing clients to request exactly what data they need, nothing more',
    example: 'GraphQL reduces over-fetching: client queries only {name, email} instead of entire user object',
    category: 'backend',
    type: 'web-services',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 153,
    term: 'gRPC',
    meaning: 'High-performance RPC framework using Protocol Buffers and HTTP/2 for inter-service communication',
    example: 'gRPC is 10x faster than REST: we switched payment service to gRPC for 50ms → 5ms latency',
    category: 'backend',
    type: 'web-services',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 204,
    term: 'Webhook',
    meaning: 'HTTP callback allowing external services to send real-time data when events occur',
    example: 'Stripe webhook: when payment succeeds, Stripe POST to /webhooks/payment with payment data',
    category: 'backend',
    type: 'web-services',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 205,
    term: 'API Gateway',
    meaning: 'Central entry point that manages routing, authentication, rate limiting for backend services',
    example: 'Kong API Gateway handles 100k+ requests/second, routes to user-service or order-service',
    category: 'backend',
    type: 'web-services',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },  
  {
    id: 206,
    term: 'OAuth 2.0',
    meaning: 'Authentication/authorization protocol allowing delegated access without sharing passwords',
    example: 'Login with Google: user approves → Google sends token → our app uses token for API calls',
    category: 'backend',
    type: 'web-services',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 207,
    term: 'JWT (JSON Web Token)',
    meaning: 'Stateless authentication token containing encoded claims like user ID, permissions, expiry',
    example: 'After login, server returns JWT token. Client sends in Authorization header for authenticated requests',
    category: 'backend',
    type: 'web-services',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 208,
    term: 'Rate Limiting',
    meaning: 'Controlling request frequency to prevent abuse and ensure fair resource usage',
    example: 'API rate limit: 100 requests/second per account. Exceeding triggers 429 Too Many Requests response',
    category: 'backend',
    type: 'web-services',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 209,
    term: 'CORS (Cross-Origin Resource Sharing)',
    meaning: 'Security mechanism allowing/restricting cross-origin requests with specific HTTP headers',
    example: 'Frontend at app.com can access backend at api.com only if server includes Access-Control-Allow-Origin header',
    category: 'backend',
    type: 'web-services',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 210,
    term: 'Service Discovery',
    meaning: 'Mechanism enabling services to find and register with each other in distributed systems',
    example: 'Consul service discovery: when payment service needs user-service, queries Consul for latest instance',
    category: 'backend',
    type: 'web-services',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },

  // Databases & Data
  {
    id: 211,
    term: 'ACID (Atomicity, Consistency, Isolation, Durability)',
    meaning: 'Properties ensuring reliable database transactions that complete successfully or fail completely',
    example: 'Bank transfer: ACID ensures money deducted from account A AND added to B atomically, never partial',
    category: 'backend',
    type: 'databases',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 212,
    term: 'CAP Theorem',
    meaning: 'Distributed systems can guarantee only 2 of 3: Consistency, Availability, Partition tolerance',
    example: 'We chose AP: system stays available during network split, accepts eventual consistency',
    category: 'backend',
    type: 'databases',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 213,
    term: 'Database Replication',
    meaning: 'Copying data across multiple database instances for redundancy and read scaling',
    example: 'Master-slave replication: primary handles writes, 3 replicas handle read queries, reduces load 10x',
    category: 'backend',
    type: 'databases',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 214,
    term: 'Sharding',
    meaning: 'Horizontal partitioning distributing data across multiple servers by shard key for scaling',
    example: 'User data sharded by user_id: users 1-1M on shard1, 1M-2M on shard2, enables handling 1B users',
    category: 'backend',
    type: 'databases',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 215,
    term: 'Database Indexing',
    meaning: 'Creating optimized lookup structures (B-tree, hash) on columns for faster query execution',
    example: 'Added index on email column: query time dropped from 2s to 50ms for 1M rows',
    category: 'backend',
    type: 'databases',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 216,
    term: 'Query Optimization',
    meaning: 'Improving SQL queries and database operations through indexing, caching, and execution planning',
    example: 'Optimized query with proper index: SELECT * FROM orders WHERE user_id = ? execution time 90% faster',
    category: 'backend',
    type: 'databases',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 217,
    term: 'Connection Pooling',
    meaning: 'Maintaining pool of reusable database connections reducing connection overhead',
    example: 'HikariCP pool with 20 connections: 1000 threads reuse 20 connections instead each creating one',
    category: 'backend',
    type: 'databases',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 218,
    term: 'Caching Layer',
    meaning: 'In-memory storage (Redis) reducing database queries and improving response time',
    example: 'Redis cache: 99% user profile queries hit Redis, 100x faster than querying database',
    category: 'backend',
    type: 'databases',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 219,
    term: 'Denormalization',
    meaning: 'Storing redundant data to improve read performance at cost of update complexity',
    example: 'Denormalized: store user_name in order table - avoids expensive join on every order query',
    category: 'backend',
    type: 'databases',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 220,
    term: 'Event Sourcing',
    meaning: 'Storing state changes as immutable events instead of storing current state snapshots',
    example: 'Payment system stores events: payment_received → payment_processed → payment_completed, rebuild state',
    category: 'backend',
    type: 'databases',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },

  // Microservices & Architecture
  {
    id: 221,
    term: 'Microservices',
    meaning: 'Architecture splitting large app into small, independent, separately deployable services',
    example: 'Netflix: auth-service, recommendation-service, payment-service - each scales independently',
    category: 'backend',
    type: 'architecture',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 222,
    term: 'Circuit Breaker',
    meaning: 'Pattern preventing cascading failures by stopping calls to failing services temporarily',
    example: 'Payment service fails 5 times: circuit opens, requests fail fast instead of timing out',
    category: 'backend',
    type: 'architecture',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 223,
    term: 'Retry Logic',
    meaning: 'Automatically retrying failed requests with exponential backoff to handle transient failures',
    example: 'API call fails: retry after 100ms, then 200ms, then 400ms - often succeeds on retry',
    category: 'backend',
    type: 'architecture',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 224,
    term: 'Load Balancing',
    meaning: 'Distributing incoming requests across multiple servers to prevent single server overload',
    example: 'Nginx load balancer distributes 10k req/s across 5 servers - each handles 2k req/s',
    category: 'backend',
    type: 'architecture',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 225,
    term: 'Horizontal Scaling',
    meaning: 'Adding more servers to handle increased load instead of upgrading single server',
    example: 'From 1 server to 10 servers: capacity increases 10x, can handle 10x more users',
    category: 'backend',
    type: 'architecture',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 226,
    term: 'Vertical Scaling',
    meaning: 'Upgrading single server with more CPU, RAM, or storage resources',
    example: 'Upgraded from 4GB RAM to 64GB: can cache 10x more data, faster query processing',
    category: 'backend',
    type: 'architecture',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 227,
    term: 'Idempotency',
    meaning: 'Property of operation producing same result regardless of how many times executed',
    example: 'Payment API: calling twice with same request_id only charges once - prevents double-charging',
    category: 'backend',
    type: 'architecture',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 228,
    term: 'Saga Pattern',
    meaning: 'Managing distributed transactions across microservices with compensation on failure',
    example: 'Order saga: reserve inventory → charge payment → if payment fails, release inventory',
    category: 'backend',
    type: 'architecture',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },

  // Message Queues & Async
  {
    id: 229,
    term: 'Message Queue',
    meaning: 'Asynchronous communication system decoupling services through message passing',
    example: 'RabbitMQ: order service publishes order.created event, email service consumes and sends email',
    category: 'backend',
    type: 'async',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 230,
    term: 'Pub/Sub Pattern',
    meaning: 'Publishers send messages to topics, subscribers receive only relevant messages',
    example: 'Kafka topic user.events: payment service AND notification service both subscribe and receive',
    category: 'backend',
    type: 'async',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 231,
    term: 'Event-Driven Architecture',
    meaning: 'System communicating via events enabling loose coupling and independent scaling',
    example: 'User signup triggers user.created event: email sent, recommendation updated, analytics logged',
    category: 'backend',
    type: 'async',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 232,
    term: 'Dead Letter Queue',
    meaning: 'Queue for messages that failed processing after retries, preventing data loss',
    example: 'Email service fails 3 times: message moved to DLQ for manual retry or investigation later',
    category: 'backend',
    type: 'async',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 233,
    term: 'Stream Processing',
    meaning: 'Continuously processing data streams for real-time analytics and transformations',
    example: 'Kafka Streams: calculate top 10 products by sales in real-time, update every minute',
    category: 'backend',
    type: 'async',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },

  // Performance & Monitoring
  {
    id: 234,
    term: 'Observability',
    meaning: 'Ability to understand system behavior through logs, metrics, and traces',
    example: 'Prometheus metrics + ELK logs + Jaeger traces: understand why p99 latency spiked at 3pm',
    category: 'backend',
    type: 'monitoring',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 235,
    term: 'Distributed Tracing',
    meaning: 'Following request across multiple services tracking latency at each hop',
    example: 'Request spans 5 services: 100ms auth, 50ms user service, 800ms payment - found bottleneck',
    category: 'backend',
    type: 'monitoring',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 236,
    term: 'SLA / SLO / SLI',
    meaning: 'SLA: contract commitment, SLO: objective (e.g., 99.9% uptime), SLI: actual measured (99.95%)',
    example: 'SLA promises 99.95% uptime, SLO is 99.9% target, SLI measures actual 99.92%',
    category: 'backend',
    type: 'monitoring',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 237,
    term: 'Latency vs Throughput',
    meaning: 'Latency: response time (ms), Throughput: requests per second',
    example: 'API metrics: 100ms latency, 10k req/s throughput - single request takes 100ms, handle 10k/s total',
    category: 'backend',
    type: 'monitoring',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 238,
    term: 'Bottleneck Analysis',
    meaning: 'Identifying slowest component limiting overall system performance',
    example: 'Database 800ms, network 100ms, processing 50ms - database is bottleneck, optimize there',
    category: 'backend',
    type: 'monitoring',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },

  // Deployment & DevOps
  {
    id: 239,
    term: 'Containerization (Docker)',
    meaning: 'Packaging application with dependencies into container for consistent deployment',
    example: 'Docker: app runs same way on laptop, staging, production - eliminates works on my machine',
    category: 'backend',
    type: 'deployment',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 240,
    term: 'Orchestration (Kubernetes)',
    meaning: 'Managing containers automatically: scheduling, scaling, failover, rolling updates',
    example: 'K8s: scale to 100 pods, auto-restart crashed pods, rolling update without downtime',
    category: 'backend',
    type: 'deployment',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 241,
    term: 'CI/CD Pipeline',
    meaning: 'Continuous Integration (test every commit) + Continuous Deployment (auto-deploy)',
    example: 'Commit → GitHub → auto-run tests → if pass, auto-deploy to production in 5 minutes',
    category: 'backend',
    type: 'deployment',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 242,
    term: 'Rolling Deployment',
    meaning: 'Gradually replacing old instances with new ones while maintaining availability',
    example: '10 servers: replace 2 at a time with new version - users always have available servers',
    category: 'backend',
    type: 'deployment',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 243,
    term: 'Canary Deployment',
    meaning: 'Deploying new version to small user percentage, monitoring before full rollout',
    example: 'Deploy to 5% users: monitor for errors, if good deploy to 100%, if bad rollback',
    category: 'backend',
    type: 'deployment',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
  {
    id: 244,
    term: 'Blue-Green Deployment',
    meaning: 'Running two identical environments, switching traffic between them for instant rollback',
    example: 'Blue (current) handles traffic, Green (new) ready - switch with one click, instant rollback if issues',
    category: 'backend',
    type: 'deployment',
    interval: 0,
    nextReview: Date.now(),
    repetitions: 0,
  },
];

// ============= SENIOR-LEVEL INTERVIEW QUESTIONS (30+) =============
// Add these to DEFAULT_QUESTIONS array

export const SENIOR_QUESTIONS = [
  {
    id: 301,
    question: 'Design a real-time notification system for 100M users. How would you handle scalability, delivery guarantees, and latency?',
    answer: `Architecture:
- Microservices: notification-service, queue-service, delivery-service
- Message queue (Kafka) for durability: ensures no notification is lost
- Service discovery (Consul) for dynamic scaling
- Push services (APNs, FCM) for mobile, WebSocket for web

Scalability:
- Kafka partitions by user_id: distribute load, enable parallel processing
- Horizontal scaling: add more notification-service instances
- Database: use MongoDB (flexible schema), replicated for reliability

Delivery Guarantees:
- Pub/Sub with confirmation: notification marked delivered only after confirmed
- Dead Letter Queue: retry failed deliveries 3x, move to DLQ if all fail
- Idempotent processing: delivery_id prevents duplicate notifications

Latency (target: <500ms from service to user device):
- Cache layer (Redis): top 10% hot users cached, 10x faster delivery
- CDN for static content, edge servers for delivery servers
- Monitor p99 latency: track at each service

Monitoring:
- Distributed tracing (Jaeger): track latency at each service
- Prometheus alerts: if delivery success rate <99.9%, page oncall
- Real-time dashboards: delivery rate, pending notifications, queue depth`,
    category: 'senior',
    difficulty: 'hard',
  },
  {
    id: 302,
    question: 'Walk me through how you would migrate a monolithic application to microservices. What are the challenges?',
    answer: `Strategy:
1. Strangler pattern: gradually replace monolith functions with services
2. Identify service boundaries: by domain (Domain-Driven Design)
3. Extract services: user-service, order-service, payment-service, etc.

Phase 1: Preparation
- Create API Gateway routing traffic between monolith and new services
- Set up service discovery (Consul/Eureka)
- Implement logging/tracing (ELK, Jaeger) for observability

Phase 2: Extract Services
- Start with leaf services (no dependencies): user-service, product-service
- Use async messaging: publish user.created event, monolith subscribes
- Database per service: prevents tight coupling, requires eventual consistency

Phase 3: Decommission Monolith
- Route 100% traffic through API Gateway to services
- Gradually turn off monolith components
- Monitor for issues, rollback if needed

Key Challenges:

1. Distributed Transactions
- Monolith: ACID transactions across modules
- Microservices: no distributed transactions, use Saga pattern
- Example: Order → reserve inventory → charge payment → if payment fails, release inventory

2. Data Consistency
- Monolith: immediate consistency
- Microservices: eventual consistency
- Solution: event-driven architecture with message queues

3. Operational Complexity
- Monolith: deploy once, everything updated
- Microservices: deploy 10 services independently, orchestrate
- Solution: Kubernetes, CI/CD pipelines, automation

4. Latency & Performance
- Monolith: function calls (microseconds)
- Microservices: network calls (milliseconds)
- Solution: caching, batching, async processing`,
    category: 'senior',
    difficulty: 'hard',
  },
  {
    id: 303,
    question: 'Design a payment processing system that handles 10k transactions per second with 99.99% uptime.',
    answer: `Architecture:
- Payment API: stateless, horizontally scalable
- Message Queue: Kafka for durability
- Payment Engine: idempotent, handles retries
- Settlement Service: batch process, reconciliation
- Risk Engine: fraud detection, velocity checks

High Availability (99.99% = 50min downtime/year):

1. Redundancy
- Active-active across 3 data centers
- Database replication with automated failover
- API Gateway health checks, traffic rerouting

2. Load Balancing
- Nginx/HAProxy distributes 10k req/s across 50 servers (200 req/s each)
- Consistent hashing for stateful processing

3. Timeouts & Retries
- Set aggressive timeouts (2s): circuit breaker if service slow
- Exponential backoff on retries: avoid thundering herd
- Max 3 retries over 10 seconds

Performance (target: <100ms response):

1. Database Optimization
- Sharding by merchant_id: payment1, payment2, etc.
- Indexes on transaction_id, merchant_id
- Connection pooling: 100 connections per server
- Read replicas for analytics

2. Caching
- Redis cache: merchant config, fraud rules (99% hit rate)
- TTL 1 hour: if merchant disabled, update within hour

3. Async Processing
- Return response immediately after payment received
- Process settlement async in background
- Customer knows payment received, settlement happens later

Idempotency & Consistency:

1. Request Idempotency
- Every request has unique transaction_id
- Database constraint: unique transaction_id
- If retry with same transaction_id: return previous response

2. Data Consistency
- Transaction saga: Payment → Settlement → Notification
- If settlement fails: reverse payment, notify customer

3. Reconciliation
- Daily reconciliation: compare our records vs bank
- Investigate discrepancies, fix in next batch`,
    category: 'senior',
    difficulty: 'hard',
  },
  {
    id: 304,
    question: 'Describe a time you optimized a backend system that was slow. What was the bottleneck and how did you fix it?',
    answer: `Situation: E-commerce platform checkout slow (3-5 seconds)

Investigation:
1. Distributed tracing (Jaeger): traced request across services
   - User-service: 100ms (normal)
   - Order-service: 200ms (normal)
   - Payment-service: 200ms (normal)
   - Inventory-service: 2500ms (BOTTLENECK!)

2. Database query: SELECT * FROM inventory WHERE product_id = ? took 2.5s

Root Cause: Full table scan on inventory table (50M rows, no index)

Solution #1: Add Index (quick fix)
- CREATE INDEX idx_inventory_product_id ON inventory(product_id)
- Query time: 2.5s → 50ms
- Checkout time: 5s → 800ms

Solution #2: Caching (long-term)
- Redis cache: inventory levels for hot products
- 80/20 rule: 20% products cause 80% queries
- Cache popular products: 99% cache hit rate
- Final checkout time: 800ms → 300ms

Lesson Learned:
- Always index frequently queried columns
- Profile first, optimize second (found real bottleneck via tracing)
- Caching for read-heavy workloads

Results:
- Checkout completion rate: 85% → 95% (reduced abandonment)
- Revenue increase: 10% from faster checkout`,
    category: 'senior',
    difficulty: 'medium',
  },
  {
    id: 305,
    question: 'How do you ensure backward compatibility when evolving an API?',
    answer: `Strategy: Versioning + Deprecation

1. API Versioning
- URL versioning: /api/v1/users, /api/v2/users
- OR Header versioning: Accept: application/vnd.company.v2+json
- Multiple versions supported: v1, v2 active; v0 deprecated

2. Semantic Versioning
- Major: breaking changes (5.0.0 from 4.9.0)
- Minor: backward-compatible additions (4.10.0)
- Patch: bug fixes (4.9.1)

3. Deprecation Process
- Month 1: Announce deprecation in API docs, email users
- Month 2-3: Return deprecation headers
  Deprecation: true
  Sunset: Wed, 21 Dec 2024 00:00:00 GMT
- Month 4: Stop accepting old version, 404 errors

4. Backward-Compatible Changes
- Add optional field: old clients ignore, new clients use
- Add optional query parameter: old clients don't send, endpoint supports both
- Keep old field: don't remove, keep returning (marked deprecated)

Example:
Old API: POST /api/v1/users → {name, email}
New API: POST /api/v1/users → {name, email, phone} (phone optional)
Old clients: still work (phone ignored if not sent)
New clients: can include phone

5. Incompatible Changes
- Remove field → create v2: don't do in v1
- Change field type (string → number) → create v2
- Change behavior (sort order) → create v2

6. Testing
- Contract testing: old client against new server, verify compatibility
- Regression tests: old API behavior still works

Result: Gradual migration, no forced updates, happy users`,
    category: 'senior',
    difficulty: 'medium',
  },
  {
    id: 306,
    question: 'Explain CAP theorem and how you would choose CP vs AP for different scenarios?',
    answer: `CAP Theorem: Pick 2 of 3
- Consistency: all nodes see same data
- Availability: system always responds
- Partition tolerance: system survives network split

CP (Consistency + Partition):
- Accept unavailability during network split
- Example: Banking (consistency critical)
- System: PostgreSQL with synchronous replication
- If network split: block writes, consistency guaranteed

AP (Availability + Partition):
- Accept stale data during network split
- Example: Social media (availability critical)
- System: NoSQL, eventual consistency
- If network split: write to local partition, sync later

Trade-offs & Scenarios:

Scenario 1: Financial System
- CAP choice: CP (Consistency over Availability)
- Rationale: data accuracy > uptime, users accept occasional downtime
- Implementation: PostgreSQL, strong consistency, synchronous replication
- If network split: block transactions rather than risk double-charge

Scenario 2: Social Media (Twitter-like)
- CAP choice: AP (Availability over Consistency)
- Rationale: 1 second delay in likes > system down
- Implementation: Cassandra, eventual consistency
- If network split: each partition accepts writes, eventual sync

Scenario 3: E-commerce Inventory
- CAP choice: Depends on tolerance
- Option 1: CP - inventory accuracy (prevent overselling)
  - Risk: during split, can't process orders
- Option 2: AP - availability (sell during split, reconcile later)
  - Risk: might oversell, refund some orders

Best Practice: Hybrid
- Consistency critical (payments): CP
- Availability critical (recommendations): AP
- Combine in single system: use CP for payments, AP for recommendations

Implementation:
- Strong Consistency: PostgreSQL, transactions
- Eventual Consistency: Kafka, event log, async sync`,
    category: 'senior',
    difficulty: 'hard',
  },
  {
    id: 307,
    question: 'Design a distributed rate limiting system for an API with 1M+ clients.',
    answer: `Challenge: Prevent single client making infinite requests when rate limit is per-client

Naive Approach (Fails at Scale):
- Rate limit in single server: bottleneck, doesn't scale
- Rate limit in app server: inconsistent (client makes parallel requests)

Solution: Distributed Rate Limiting

Architecture:
- Redis cluster: centralized rate limit counter
- Every API server queries Redis: can user_id make request?
- Redis response: yes/no + remaining quota

Algorithm (Token Bucket):
- Each user has bucket of N tokens (e.g., 100 req/minute)
- Each request consumes 1 token
- Tokens refill over time (1 token/6ms for 100/min rate)
- Request allowed if tokens > 0

Implementation: Redis Lua Script (atomic)
- KEYS[1] = rate_limit:user_123
- Get current tokens
- Decrement by 1 (minimum 0)
- Return remaining tokens
- If tokens >= 0, allow request, else return 429

Scaling Issues:

1. Redis Single Point of Failure
- Solution: Redis Cluster (multiple nodes)
- Each node handles subset of users
- Consistent hashing: user_123 always routes to same node

2. Latency (Redis network call)
- Solution: Local cache + eventual consistency
- Cache: user_123 has 50 tokens left, expires in 10 seconds
- After 10 seconds: refetch from Redis
- Fast path: check local cache, 99% hit rate

3. Distributed Clock Skew
- Problem: server timestamps differ
- Solution: use Redis timestamp (CURRENT_TIME in Lua script)
- All servers agree on time via Redis

4. Burst Traffic
- User makes 100 requests in 1 second when limit is 100/minute
- Solution: leaky bucket instead of token bucket
- Smooth out requests, process at constant rate
- Excess requests wait or get rejected`,
    category: 'senior',
    difficulty: 'hard',
  },
  {
    id: 308,
    question: 'How would you debug a performance issue in production that you cannot reproduce locally?',
    answer: `Systematic Debugging Approach:

1. Gather Data (Don't fix blindly)
- Distributed tracing: where is time spent? (Jaeger, Lightstep)
- Prometheus metrics: latency percentiles, error rates, RPS
- Application logs: errors, warnings, slow queries
- User reports: which features affected? specific time?

2. Narrow Down
- Timing: when did issue start? correlation with deploy?
- Geography: all users or specific region?
- User segment: enterprise customers or free tier?
- Reproducibility: always slow or sporadic?

3. Observe Production Safely
- Sampling: trace 1% of requests to understand pattern
- Real-time dashboards: watch metrics as changes made
- Feature flags: enable/disable features to isolate cause

4. Hypothesis Testing

Hypothesis 1: Database Slow
- Slow query log: find queries >100ms
- Query execution plan: EXPLAIN SELECT
- Fix: add index, optimize query

Hypothesis 2: External Service Slow
- Distributed tracing: payment-service takes 3 seconds?
- Check payment provider status: their servers down?
- Timeout setting: 10 seconds timeout, service takes 9s
- Fix: add circuit breaker, use fallback, page on-call

Hypothesis 3: Resource Exhaustion
- CPU usage: 95%? find hot function via profiler
- Memory: 99%? memory leak? cache growing unbounded?
- Disk I/O: queued requests? disk full?
- Network: packet loss? congestion?
- Fix: scale vertically/horizontally, optimize

5. Implement Fix
- Small change: if one variable changed, revert first
- Monitor closely: measure before/after with metrics
- Gradual rollout: 10% → 50% → 100%
- Rollback: if issues appear, instant rollback

6. Post-Mortem
- Why did this happen? fix root cause, not symptom
- What should have caught this? add monitoring?
- Documentation: add to runbook`,
    category: 'senior',
    difficulty: 'hard',
  },
];

// Combine for export
export const DEFAULT_VOCABULARY_EXTENDED = [
  ...DEFAULT_VOCAB, // existing vocab
  ...BACKEND_VOCABULARY, // new backend vocabulary
];

export const DEFAULT_QUESTIONS_EXTENDED = [
  ...DEFAULT_QUESTIONS, // existing questions
  ...SENIOR_QUESTIONS, // new senior questions
];