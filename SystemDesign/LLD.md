# Low-Level Design (LLD)
## SplitSmart – Fraud-Resistant Expense Splitting Platform

---

## 1. Document Overview
This document defines the Low-Level Design (LLD) for the SplitSmart platform, detailing internal service logic, database schemas, and API contracts.

---

## 2. Infrastructure Services

### 2.1 API Gateway (Spring Cloud Gateway)
- **Authentication**: JWT validation filter.
- **Routing**: Predicate-based routing to domain services.
- **Rate Limiting**: Redis-backed request throttling.

### 2.2 Service Discovery (Eureka)
- **Role**: Maintains service registry and metadata.
- **Communication**: Heartbeat-based health monitoring.

---

## 3. Domain Microservices

### 3.1 Auth Service (Identity & Access)
**Responsibility**: Registration, Authentication, and JWT issuance.

#### Database: `users`
| Field | Type | Constraint |
| :--- | :--- | :--- |
| `user_id` | UUID | PRIMARY KEY |
| `name` | VARCHAR(100) | NOT NULL |
| `email` | VARCHAR(256) | UNIQUE, NOT NULL |
| `password_hash` | VARCHAR(255) | NOT NULL |
| `role_id` | INT | FK to roles |

#### Key Endpoints
- `POST /auth/register`: Create new user.
- `POST /auth/login`: Authenticate and return JWT.
- `GET /auth/validate`: Verify JWT validity.

---

### 3.2 Group Service
**Responsibility**: Group lifecycle and membership management.

#### Database: `groups`, `group_members`
- **Groups**: `id (UUID)`, `name`, `created_by`, `created_at`.
- **Members**: `id (UUID)`, `group_id`, `user_id`, `role (ADMIN/MEMBER)`.

#### Key Endpoints
- `POST /groups`: Create new group.
- `POST /groups/{groupId}/members`: Add user to group.
- `GET /groups/{groupId}/summary`: View dashboard details.

---

### 3.3 Expense Service
**Responsibility**: Expense lifecycle, split calculations, and audit logging.

#### Database: `expenses`, `expense_participants`
- **Expenses**: `id (UUID)`, `amount`, `status`, `created_by`, `description`.
- **Participants**: `id (UUID)`, `expense_id`, `user_id`, `share_amount`.

#### Key Endpoints
- `POST /expenses`: Create expense (Triggers `ExpenseCreated` event).
- `PUT /expenses/{id}`: Edit expense (Allowed if PENDING).
- `DELETE /expenses/{id}`: Soft delete (Triggers `ExpenseDeleted` AI check).

---

### 3.4 Approval Service (Majority Voting)
**Responsibility**: Voting logic and state transition control.

#### Logic Engine
- **Majority Rule**: `approved_votes > (total_participants / 2)`.
- **Forced Rule**: If `FRAUD_WARNING`, requires 100% approval.

#### Database: `expense_votes`
| Field | Type | Description |
| :--- | :--- | :--- |
| `vote_id` | UUID | PK |
| `expense_id` | UUID | FK to expense |
| `user_id` | UUID | FK to user |
| `vote` | VARCHAR | APPROVE / REJECT |

---

### 3.5 Balance & Settlement Service
**Responsibility**: Peer-to-peer debt ledger and transaction optimization.

#### Optimization Algorithm
- Uses graph reduction to minimize the number of payments required to settle a group.

#### Database: `balances`, `settlements`
- **Balances**: `debtor_id`, `creditor_id`, `amount`.
- **Settlements**: `from_user`, `to_user`, `amount`, `timestamp`.

---

### 3.6 Fraud Detection Service (Gemini AI)
**Responsibility**: Risk scoring via rule-based checks and AI analysis.

#### Fraud Score Calculation
```text
Score = (RuleWeight * RuleMatches) + (AIWeight * GeminiConfidence)
```

#### Triggers
- Listen for `ExpenseCreated` and `ExpenseDeleted` via Kafka.
- If `Score > Threshold`, set expense status to `FRAUD_WARNING`.

---

### 3.7 Notification Service
**Responsibility**: Real-time user alerts via WebSockets and Kafka.
- **Events**: `EXPENSE_CREATED`, `APPROVAL_REQUIRED`, `FRAUD_ALERT`.

---

## 4. Communication Architecture

### Synchronous Requests
- **Feign Clients**: For direct inter-service verification (e.g., Expense Service calling Approval Service).

### Asynchronous Events (Kafka)
| Event Name | Producer | Consumers |
| :--- | :--- | :--- |
| `ExpenseCreated` | Expense Service | Fraud, Notification, Balance |
| `ExpenseDeleted` | Expense Service | Fraud, Notification |
| `VoteRecorded` | Approval Service | Balance (if threshold met) |

---

## 5. Settlement Optimization
**Goal**: Reduce "A owes B, B owes C" into "A owes C".
- **Implementation**: Graph theory approach using net balances per user to calculate minimal edges in the settlement graph.

---

## 6. Conclusion
This LLD provides the full technical roadmap for implementing SplitSmart. By decoupling domain logic into microservices and using Kafka for background tasks, the system achieves maximum fault tolerance and auditability.
