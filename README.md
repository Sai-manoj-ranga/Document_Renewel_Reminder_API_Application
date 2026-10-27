<div align="center">

# 📄 Document Renewal Reminder

**Never miss an expiry date again.** A full-stack app to track passports, licenses, insurance policies and certificates, and see at a glance what is valid, due for renewal, or already expired.

![Java](https://img.shields.io/badge/Java-25-ED8B00?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1.1-6DB33F?logo=springboot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)
![React](https://img.shields.io/badge/React-19-20232A?logo=react&logoColor=61DAFB)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-API_Testing-FF6C37?logo=postman&logoColor=white)

</div>

---

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Configuration](#configuration)
- [Data Model](#data-model)
- [API Documentation](#api-documentation)
- [Usage Guide](#usage-guide)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [Author and Contact](#author-and-contact)

---

## About the Project

Important documents expire quietly, and renewing them late can be costly or stressful. **Document Renewal Reminder** lets you store each document with its issue and expiry dates, choose how many days in advance you want to be warned, and instantly see its status.

The repository has two parts:

| Folder | Description |
|---|---|
| [`document_renewel_reminder/`](document_renewel_reminder) | Backend REST API (Spring Boot + MySQL) |
| [`doc_renewel_frontend/`](doc_renewel_frontend) | Frontend web app (React + Bootstrap) |

---

## Features

**Backend**

- Full CRUD for document records
- Documents returned sorted by soonest expiry first
- Computed `daysRemaining` and `expiryStatus` on every document
- Custom reminder window per document (default 30 days)
- Server-side validation with clear error messages
- CORS configured for `http://localhost:3000`
- Tables created automatically by Hibernate

**Frontend**

- Dashboard cards: Total, Valid, Renewal Soon, Expired
- Add and edit documents with one form
- Document type dropdown (Passport, Driving License, Aadhaar Card, PAN Card, Insurance, Visa, Certificate, Other)
- Color-coded status badges
- Search by name, type, holder, or reference number
- Filter by expiry status
- Details modal, delete confirmation, loading spinner, and success/error alerts
- Client-side validation before submitting

**Expiry statuses**

| Status | Meaning |
|---|---|
| 🟢 `VALID` | Expiry is further away than the reminder window |
| 🟡 `RENEWAL_SOON` | Expiry is within `reminderDaysBefore` days |
| 🔴 `EXPIRED` | Expiry date is today or already past |
| 🔵 `RENEWED` | Document has been marked as renewed |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend language | Java 25 |
| Backend framework | Spring Boot 4.1.1 (Web MVC, Data JPA, Validation) |
| Database | MySQL |
| Build tool | Maven (wrapper included) |
| Backend utilities | Lombok, Spring Boot DevTools |
| Frontend library | React 19 (Create React App) |
| Styling | Bootstrap 5.3 + custom CSS |
| HTTP client | Axios |
| API testing | Postman |

---

## Architecture

```text
┌──────────────────────┐        HTTP / JSON        ┌────────────────────────────────────┐
│ React JS + Bootstrap │  ───────────────────────► │         Spring Boot API            │
│   (localhost:3000)   │  ◄─────────────────────── │         (localhost:1819)           │
└──────────────────────┘                           │  Controller → Service → Repository │
                                                   └──────────────────┬─────────────────┘
                                                                      │ JPA / Hibernate
                                                                      ▼
                                                           ┌────────────────────┐
                                                           │ MySQL: doc_renewal │
                                                           └────────────────────┘
```

---

## Project Structure

```text
Document_Renewel_Reminder_API_Application/
├── document_renewel_reminder/                 # Spring Boot backend
│   ├── pom.xml
│   ├── mvnw / mvnw.cmd
│   └── src/
│       ├── main/
│       │   ├── java/com/projects/document_renewel_reminder/
│       │   │   ├── DocumentRenewelReminderApplication.java
│       │   │   ├── controller/DocumentRenewelController.java
│       │   │   ├── service/DocumentRenewelService.java
│       │   │   ├── service/DocumentRenewelServiceImpl.java
│       │   │   ├── repo/DocRenewelRepo.java
│       │   │   └── model/DocumentRenewel.java
│       │   └── resources/application.properties
│       └── test/                              # Test classes
│
└── doc_renewel_frontend/                      # React frontend
    ├── public/
    ├── src/
    │   ├── api/documentApi.js                 # Axios instance (API base URL)
    │   ├── App.js                             # Dashboard, form, table, details modal
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    └── package.json
```

---

## Prerequisites

| Tool | Version |
|---|---|
| JDK | 25 |
| MySQL | 8.x or later |
| Node.js and npm | Latest LTS |
| Maven | Optional (the `mvnw` wrapper is included) |
| Postman | Optional, for API testing |

---

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Sai-manoj-ranga/Document_Renewel_Reminder_API_Application.git
cd Document_Renewel_Reminder_API_Application
```

### 2. Create the database

```sql
CREATE DATABASE doc_renewal;
```

The `document_renewal` table is created automatically on first run.

### 3. Run the backend

```bash
cd document_renewel_reminder

# Linux / macOS
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run
```

The API starts at **http://localhost:1819**. Run tests with `./mvnw test`.

### 4. Run the frontend

Open a new terminal:

```bash
cd doc_renewel_frontend
npm install
npm start
```

The app opens at **http://localhost:3000**.

Other frontend scripts:

```bash
npm run build   # production build
npm test        # run tests
```

---

## Configuration

### Backend: `document_renewel_reminder/src/main/resources/application.properties`

```properties
spring.application.name=document_renewel_reminder
server.port=1819

spring.datasource.url=jdbc:mysql://localhost:3306/doc_renewal
spring.datasource.username=<your-mysql-username>
spring.datasource.password=<your-mysql-password>
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

> Avoid committing real credentials. Spring Boot also reads the environment variables `SPRING_DATASOURCE_USERNAME` and `SPRING_DATASOURCE_PASSWORD`, which override the file.

### Frontend: `doc_renewel_frontend/src/api/documentApi.js`

```javascript
const apiClient = axios.create({
  baseURL: 'http://localhost:1819', // change if your backend runs elsewhere
  headers: { 'Content-Type': 'application/json' },
});
```

The backend allows CORS only from `http://localhost:3000`. If you change the frontend URL, update `@CrossOrigin` in `DocumentRenewelController.java`.

---

## Data Model

**Table:** `document_renewal`

| Field | Type | Required | Description |
|---|---|:---:|---|
| `id` | Long | auto | Primary key (auto-increment) |
| `documentName` | String (max 100) | ✅ | e.g. "Passport" |
| `documentType` | String (max 50) | ✅ | e.g. "Identity", "Insurance" |
| `holderName` | String (max 100) | ✅ | Person the document belongs to |
| `referenceNumber` | String (max 100) | ❌ | Document or policy number |
| `issueDate` | Date | ✅ | Format `yyyy-MM-dd` |
| `expiryDate` | Date | ✅ | Must be after `issueDate` |
| `reminderDaysBefore` | Integer | ❌ | Minimum 1, default 30 |
| `notes` | String (max 500) | ❌ | Free-form notes |
| `renewed` | Boolean | ❌ | Default `false` |

**Computed, read-only fields in responses:**

| Field | Description |
|---|---|
| `daysRemaining` | Days between today and `expiryDate` (negative if already expired) |
| `expiryStatus` | `VALID`, `RENEWAL_SOON`, `EXPIRED`, or `RENEWED` |

---

## API Documentation

**Base URL:** `http://localhost:1819`

| Method | Endpoint | Description |
|:---:|---|---|
| `GET` | `/getDocuments` | List all documents, sorted by expiry date |
| `GET` | `/getDocumentById/{id}` | Get one document |
| `POST` | `/createDoc` | Create a document (validated) |
| `PUT` | `/updateDoc/{id}` | Update a document (send all fields) |
| `DELETE` | `/deleteDoc/{id}` | Delete a document |

**Sample request (`POST /createDoc`)**

```json
{
  "documentName": "Passport",
  "documentType": "Identity",
  "holderName": "Sai Manoj",
  "referenceNumber": "N1234567",
  "issueDate": "2020-03-15",
  "expiryDate": "2030-03-14",
  "reminderDaysBefore": 90,
  "notes": "Renew at least 3 months before expiry"
}
```

**Sample response**

```json
{
  "id": 1,
  "documentName": "Passport",
  "documentType": "Identity",
  "holderName": "Sai Manoj",
  "referenceNumber": "N1234567",
  "issueDate": "2020-03-15",
  "expiryDate": "2030-03-14",
  "reminderDaysBefore": 90,
  "notes": "Renew at least 3 months before expiry",
  "renewed": false,
  "daysRemaining": 1248,
  "expiryStatus": "VALID"
}
```

**Sample `DELETE` response**

```text
Document 1 deleted successfully
```

**Validation rules (enforced on `POST /createDoc`)**

| Rule | Error message |
|---|---|
| `documentName` must not be blank | Document Name is must required |
| `documentType` must not be blank | Document Type is must required |
| `holderName` must not be blank | Holder Name is required |
| `reminderDaysBefore` must be at least 1 | Reminder must be at least 1 day |
| `expiryDate` must be after `issueDate` | Expiry date must be after issue date |
| Length limits on text fields | Standard size validation error |

---

## Usage Guide

1. Start the backend, then the frontend.
2. Fill in the **Add New Document** form and click **Add Document**.
3. Use the search box and status filter to find documents.
4. Click **View** for details, **Edit** to modify, or **Delete** to remove.
5. Tick "This document has been renewed" while editing to mark it as renewed.

**Testing the API with Postman**

| # | Request | Method | URL |
|:---:|---|:---:|---|
| 1 | Create document | `POST` | `http://localhost:1819/createDoc` |
| 2 | Get all documents | `GET` | `http://localhost:1819/getDocuments` |
| 3 | Get document by ID | `GET` | `http://localhost:1819/getDocumentById/1` |
| 4 | Update document | `PUT` | `http://localhost:1819/updateDoc/1` |
| 5 | Delete document | `DELETE` | `http://localhost:1819/deleteDoc/1` |

For `POST` and `PUT`, choose **Body → raw → JSON**.

**Screenshots**

| Screen | Screenshot |
|---|---|
| Dashboard | <img width="932" height="434" alt="image" src="https://github.com/user-attachments/assets/2eba59e5-5906-4258-961a-dcb7c50d252f" /> |
| Add / Edit form | <img width="920" height="339" alt="image" src="https://github.com/user-attachments/assets/21f02951-ffbd-41a7-a94d-f4948598358b" />
<img width="918" height="335" alt="image" src="https://github.com/user-attachments/assets/2279e18b-aac3-44e3-a7da-1fa83b74e37d" /> |
| Details modal | <img width="900" height="436" alt="image" src="https://github.com/user-attachments/assets/11f5e639-1705-468f-b8c5-064e68d86566" />
<img width="927" height="429" alt="image" src="https://github.com/user-attachments/assets/60c3373b-b41d-4e42-8afa-a778c865a274" /> 
<img width="925" height="272" alt="image" src="https://github.com/user-attachments/assets/fd71bf98-5299-42b8-bc24-2c13fc886e83" /> |

---

## Future Improvements

- Email or push notifications for upcoming expiries
- Authentication and per-user documents
- Move the frontend API URL to an environment variable (`REACT_APP_API_URL`)
- Add `@Valid` to `PUT /updateDoc/{id}`
- Global exception handler with proper 404 responses
- Pagination and sorting in the table
- Swagger / OpenAPI documentation

---

## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## Author and Contact

**Ranga Sai Manoj**

[![GitHub](https://img.shields.io/badge/GitHub-Sai--manoj--ranga-181717?logo=github&logoColor=white)](https://github.com/Sai-manoj-ranga)
Email: rangasaimanoj1919@gmail.com

<div align="center">

⭐ If you found this project useful, consider giving it a star!

</div>
