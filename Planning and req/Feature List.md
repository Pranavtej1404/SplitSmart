# Feature List – SplitSmart
## Fraud-Resistant Expense Splitting Platform

This document defines the complete feature list for the SplitSmart platform, categorized by system functionality.

---

## 1. User Management
| Feature ID | Feature Name | Description | Status |
| :--- | :--- | :--- | :--- |
| **F1** | User Registration | Create account with email/password validation. | [x] |
| **F2** | User Login | Secure authentication and session management. | [x] |
| **F3** | Profile Management | Update user details (name, profile info). | [x] |

## 2. Group Management
| Feature ID | Feature Name | Description | Status |
| :--- | :--- | :--- | :--- |
| **F4** | Create Group | Users can create new shared finance groups. | [x] |
| **F5** | Invite Members | Members can invite others via UserId. | [x] |
| **F6** | Remove Members | Participant removal and access management. | [x] |
| **F7** | Dashboard View | Summary of expenses, members, and balances. | [x] |
| **F7.1** | Group Edit | Update group name (requires owner role). | [x] |

## 3. Expense Management & Logic
| Feature ID | Feature Name | Description | Status |
| :--- | :--- | :--- | :--- |
| **F8** | Add Expense | Standard creation with title, amount, and payer. | [x] |
| **F9** | Split Logic | Support for **Equal** and **Custom** splitting. | [x] |
| **F10** | Expense Listing | Group-wide list of all active transactions. | [x] |
| **F11** | Detailed View | Access to approvals, receipt, and status logs. | [x] |

## 4. Approval System
| Feature ID | Feature Name | Description | Status |
| :--- | :--- | :--- | :--- |
| **F12** | Approval Request | Automated request sent to all involved participants. | [x] |
| **F13** | Majority Rule | 50%+ participants must approve to finalize. | [x] |
| **F14** | Rejection | Dispute mechanism to block fraudulent entries. | [x] |

## 5. Lifecycle & Immutability
| Feature ID | Feature Name | Description | Status |
| :--- | :--- | :--- | :--- |
| **F15** | Expense Editing | Modification allowed *only* while PENDING. | [x] |
| **F16** | Soft Deletion | "Audit-safe" removal; remains in database for logs. | [x] |
| **F17** | Deletion Fraud | AI check triggers immediately upon deletion. | [x] |

## 6. Hybrid Fraud Detection
| Feature ID | Feature Name | Description | Status |
| :--- | :--- | :--- | :--- |
| **F18** | Rule-Based | Logic for large amounts, duplicates, and variance. | [x] |
| **F19** | AI Analysis | **Google Gemini** evaluates credibility of descriptions. | [x] |
| **F20** | Risk Scoring | Composite score (0-100) determining risk level. | [x] |
| **F21** | Fraud Warning | Real-time UI alert for flagged transactions. | [x] |
| **F22** | Forced Approval | High-risk items require **unanimous** (100%) consent. | [x] |
| **F23** | Recommendation | System prompts for receipt upload to lower risk. | [x] |

## 7. Balances & Settlements
| Feature ID | Feature Name | Description | Status |
| :--- | :--- | :--- | :--- |
| **F24** | Status Tracking | Real-time lifecycle visibility (Approved/Rejected/etc). | [x] |
| **F25** | Balance Calc | Maintenance of peer-to-peer debt matrices. | [x] |
| **F26** | Settlements | Manual marking of settled debts (External payment). | [x] |

## 8. Notifications & Auditing
| Feature ID | Feature Name | Description | Status |
| :--- | :--- | :--- | :--- |
| **F27** | Event Alerts | Notifications for expenses, approvals, and rejections. | [x] |
| **F28** | Settlement Alerts | Confirmation of updated balances. | [x] |
| **F29** | Activity Logging | Audit logs for creation, edits, and deletions. | [x] |
| **F30** | History Tracking | Timeline view of all historical activity for an expense. | [x] |

---

## 9. Technical Summary
- **Primary Stack**: Next.js, Spring Boot, MySQL.
- **AI Integration**: Spring AI + Google Gemini.
- **Infrastructure**: Kafka (Events), Eureka (Registry), API Gateway.

## 10. Future Feature Roadmap
- **OCR Receipt Analysis**: Automated form filling from images.
- **Settlement Optimization**: Algorithms to reduce net transaction volume.
- **Mobile Native App**: iOS/Android development.
- **Reporting**: PDF export for monthly group spend analysis.
