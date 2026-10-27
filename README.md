<div align="center">

<img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java" />
<img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot" />
<img src="https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white" alt="Maven" />
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
<img src="https://img.shields.io/badge/Spring_Boot_DevTools-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring Boot DevTools" />
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React JS" />
<img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap" />
<img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white" alt="Postman" />

# 📄 Document Renewal Reminder

**Never miss an expiry date again.** A full-stack application to track passports, licenses, insurance policies and certificates, and see at a glance what is valid, due for renewal, or already expired.

</div>

---

## 📑 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Data Model](#-data-model)
- [API Reference](#-api-reference)
- [Testing with Postman](#-testing-with-postman)
- [Validation Rules](#-validation-rules)
- [Author](#-author)

---

## 📌 About the Project

Important documents expire quietly, and renewing them late can be costly or stressful. **Document Renewal Reminder** lets you store each document with its issue and expiry dates, set how many days in advance you want to be warned, and instantly see its status.

The project is split into two parts:

- **Backend:** a RESTful API built with Spring Boot and MySQL
- **Frontend:** a React JS client styled with Bootstrap

---

## ✨ Features

- ➕ Create, view, update and delete document records (full CRUD)
- ⏳ Automatic **days remaining** calculation for every document
- 🚦 Smart **expiry status** for each document:

  | Status | Meaning |
  |---|---|
  | 🟢 `VALID` | Expiry is further away than the reminder window |
  | 🟡 `RENEWAL_SOON` | Expiry is within `reminderDaysBefore` days |
  | 🔴 `EXPIRED` | Expiry date is today or already past |
  | 🔵 `RENEWED` | Document has been marked as renewed |

- 📅 Documents sorted by **soonest expiry first**
- ⚙️ Custom reminder window per document (default **30 days**)
- ✅ Server-side validation with clear error messages
- 🌐 CORS pre-configured for the React app on `http://localhost:3000`

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 25 |
| Backend framework | Spring Boot 4.1.1 (Spring Web MVC, Spring Data JPA, Bean Validation) |
| Database | MySQL |
| Build tool | Maven (wrapper included) |
| Developer tooling | Spring Boot DevTools, Lombok |
| Frontend | React JS |
| Styling | Bootstrap |
| API testing | Postman |

---

## 🏗 Architecture

```
┌──────────────────────┐        HTTP / JSON        ┌────────────────────────────────────┐
│  React JS + Bootstrap│  ───────────────────────► │         Spring Boot API            │
│   (localhost:3000)   │  ◄─────────────────────── │         (localhost:1819)           │
└──────────────────────┘                           │                                    │
                                                   │  Controller → Service → Repository │
                                                   └──────────────────┬─────────────────┘
                                                                      │ JPA / Hibernate
                                                                      ▼
                                                           ┌────────────────────┐
                                                           │   MySQL            │
                                                           │   doc_renewal DB   │
                                                           └────────────────────┘
```

---

## 📂 Project Structure

```
Document_Renewel_Reminder_API_Application/
│
├── document_renewel_reminder/                  # ☕ Spring Boot backend
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
│       └── test/                               # Test classes
│
└── doc_renewel_frontend/                       # ⚛️ React + Bootstrap frontend
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| JDK | 25 |
| MySQL | 8.x or later |
| Node.js & npm | Latest LTS |
| Maven | Optional (the `mvnw` wrapper is included) |
| Postman | Optional, for API testing |

### 1. Clone the repository

```bash
git clone https://github.com/Sai-manoj-ranga/Document_Renewel_Reminder_API_Application.git
cd Document_Renewel_Reminder_API_Application
```

### 2. Set up the database

```sql
CREATE DATABASE doc_renewal;
```

The `document_renewal` table is created automatically on first run (`spring.jpa.hibernate.ddl-auto=update`).

### 3. Configure the backend

Open `document_renewel_reminder/src/main/resources/application.properties` and set your own MySQL credentials:

```properties
spring.application.name=document_renewel_reminder
server.port=1819

spring.datasource.url=jdbc:mysql://localhost:3306/doc_renewal
spring.datasource.username=<your-mysql-username>
spring.datasource.password=<your-mysql-password>
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

### 4. Run the backend

```bash
cd document_renewel_reminder

# Linux / macOS
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run
```

The API starts at **http://localhost:1819**. Thanks to Spring Boot DevTools, the app restarts automatically when you change code during development.

### 5. Run the frontend

```bash
cd doc_renewel_frontend
npm install
npm start
```

The React app opens at **http://localhost:3000**.

---

## 🗄 Data Model

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

**Computed fields (read-only, included in responses):**

| Field | Description |
|---|---|
| `daysRemaining` | Days between today and `expiryDate` (negative if already expired) |
| `expiryStatus` | One of `VALID`, `RENEWAL_SOON`, `EXPIRED`, `RENEWED` |

---

## 🔌 API Reference

**Base URL:** `http://localhost:1819`

| Method | Endpoint | Description |
|:---:|---|---|
| `GET` | `/getDocuments` | List all documents, sorted by expiry date (ascending) |
| `GET` | `/getDocumentById/{id}` | Get a single document by ID |
| `POST` | `/createDoc` | Create a new document |
| `PUT` | `/updateDoc/{id}` | Update an existing document |
| `DELETE` | `/deleteDoc/{id}` | Delete a document |

### Sample request body (`POST /createDoc`)

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

### Sample response

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

### Sample `DELETE` response

```
Document 1 deleted successfully
```

> **Note:** `PUT /updateDoc/{id}` replaces all editable fields, so always send the complete document.

---

## 🧪 Testing with Postman

All endpoints were designed to be tested with [Postman](https://www.postman.com/). Follow these steps to try them out:

1. Start the backend (`http://localhost:1819`).
2. Open Postman and create a new collection called **Document Renewal Reminder**.
3. Add the requests below.

| # | Request | Method | URL | Body |
|:---:|---|:---:|---|---|
| 1 | Create document | `POST` | `http://localhost:1819/createDoc` | raw → JSON (see sample above) |
| 2 | Get all documents | `GET` | `http://localhost:1819/getDocuments` | none |
| 3 | Get document by ID | `GET` | `http://localhost:1819/getDocumentById/1` | none |
| 4 | Update document | `PUT` | `http://localhost:1819/updateDoc/1` | raw → JSON (full document) |
| 5 | Delete document | `DELETE` | `http://localhost:1819/deleteDoc/1` | none |

**Tips**

- For `POST` and `PUT`, choose **Body → raw → JSON** and add the header `Content-Type: application/json`.
- Create a Postman **environment variable** `baseUrl = http://localhost:1819` and use `{{baseUrl}}/getDocuments` to switch environments easily.
- To see the status logic in action, create a document with an `expiryDate` within `reminderDaysBefore` days and confirm `expiryStatus` returns `RENEWAL_SOON`.

---

## ✅ Validation Rules

| Rule | Error message |
|---|---|
| `documentName` must not be blank | Document Name is must required |
| `documentType` must not be blank | Document Type is must required |
| `holderName` must not be blank | Holder Name is required |
| `reminderDaysBefore` must be at least 1 | Reminder must be at least 1 day |
| `expiryDate` must be after `issueDate` | Expiry date must be after issue date |
| Length limits on name, type, holder, reference and notes fields | Standard size validation error |

Validation is enforced on `POST /createDoc`.

---

## 👤 Author

**Sai Manoj Ranga**

[![GitHub](https://img.shields.io/badge/GitHub-Sai--manoj--ranga-181717?style=flat&logo=github&logoColor=white)](https://github.com/Sai-manoj-ranga)

---

<div align="center">

⭐ If you found this project useful, consider giving it a star!

</div>
