# || Documentation ||

## Project Name
-> Finance Data Processing and Access Control Backend 

## Description
-> A backend REST API built for a finance dashboard system. It lets different users interact with financial records based on their role. 
An admin can create and manage records, an analyst can view and analyse them, and a viewer can only read. The goal was to build a clean, simple, and well structured backend that could serve data to a frontend dashboard.

## Tech Stack
Tool - Why I used it ? 

Node.js - JavaScript on the server, simple and fast 
Express - Minimal framework, easy to structure routes 
MongoDB - Flexible document storage, great for financial records 
Mongoose - Makes MongoDB easier to work with using schemas 
JWT - Stateless authentication, no session storage needed 
bcryptjs - Secure password hashing before saving to database 
dotenv - Keeps secrets like JWT key out of the codebase 

## How to Run Locally
**Requirements — make sure these are installed first:**
- Node.js v18 or above
- MongoDB running locally

**Step 1 — Clone the repo**
```bash
git clone 
cd finance-backend
```

**Step 2 — Install dependencies**
```bash
npm install
```

**Step 3 — Create a `.env` file in the root folder**

**Step 4 — Start the server**
```bash
npm run dev
```

Server runs at `http://localhost:5000`

You should see this in the terminal: MongoDB connected
                                     Server running on port 5000

## Folder Structure
finance-backend/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection setup
│   ├── models/
│   │   ├── User.model.js      # User schema with role and password hashing
│   │   └── Record.model.js    # Financial record schema with soft delete
│   ├── controllers/
│   │   ├── auth.controller.js      # Register, login, get profile
│   │   ├── record.controller.js    # CRUD and filtering for records
│   │   └── dashboard.controller.js # Summary calculations
│   ├── routes/
│   │   ├── auth.routes.js          # /api/auth endpoints
│   │   ├── record.routes.js        # /api/records endpoints
│   │   └── dashboard.routes.js     # /api/dashboard endpoints
│   ├── middleware/
│   │   ├── auth.middleware.js      # Verifies JWT token on every request
│   │   └── role.middleware.js      # Checks if user role has permission
│   └── app.js                 # Express app setup and route mounting
├── server.js                  # Entry point, starts the server
├── .env                       # Secret config (not pushed to GitHub)
├── .gitignore
└── README.md

---

## User Roles

| Role | What they can do |
|---|---|
| viewer | Read financial records only |
| analyst | Read records and view dashboard summary |
| admin | Full access — create, update, delete records and view dashboard |

---

## API Endpoints

### Auth Routes

| Method | Endpoint | Access | What it does |
|---|---|---|---|
| POST | /api/auth/register | Public | Create a new user |
| POST | /api/auth/login | Public | Login and receive JWT token |
| GET | /api/auth/me | Any logged in user | Get your own profile |

### Record Routes

| Method | Endpoint | Access | What it does |
|---|---|---|---|
| GET | /api/records | All logged in | Get all records, supports filters |
| POST | /api/records | Admin, Analyst | Create a new financial record |
| PUT | /api/records/:id | Admin only | Update an existing record |
| DELETE | /api/records/:id | Admin only | Soft delete a record |

### Dashboard Routes

| Method | Endpoint | Access | What it does |
|---|---|---|---|
| GET | /api/dashboard/summary | Admin, Analyst | Get total income, expenses and balance |

---

## How to Test

Download Postman and follow these steps in order.

For every protected route add this in Headers:
Key:   Authorization
Value: Bearer <paste your token here>

**1. Register an admin user**

POST http://localhost:5000/api/auth/register
Body:
{
"name": "sayali",
"email": "say@li.com",
"password": "secret123",
"role": "admin"
}

**2. Login and copy the token**

POST http://localhost:5000/api/auth/login
Body:
{
"email": "say@li.com",
"password": "secret123"
}

**. After that use the token in headers and try these:**
Copy the token from the response. You will use it in all requests below.

**3. Get your profile**

**4. Create a record**

**5. Create an expense**

**6. Get all records**

**7. Filter records by type**

**8. Update a record**

**9. Delete a record**

**10. Get dashboard summary**
-> Response will look like:
json
{
  "totalIncome": 5000,
  "totalExpenses": 1500,
  "netBalance": 3500
}


**Test role blocking — register a viewer and try to create a record:**

Login as viewer, then try POST /api/records with his token.
You will get:

{
  "message": "Access denied. This action needs: admin or analyst"
}

## Assumptions Made

- **Any role can be assigned at registration.** In a real system only an 
  admin would be able to assign roles. This was kept open for easy testing.

- **Soft delete instead of hard delete.** When a record is deleted it is 
  marked as isDeleted: true and hidden from all responses. The data is 
  never permanently removed so history is preserved.

- **Dashboard recalculates every request.** There is no caching. The 
  summary is calculated fresh each time from the records collection. This 
  is fine for small datasets and keeps the code simple.

- **No pagination.** All records are returned in one response. This was a 
  deliberate choice to keep the code readable for this assignment.

- **JWT secret is in .env only.** It is not validated for complexity or 
  rotated. Acceptable for development but would need proper secret 
  management in production.

- **No email verification.** Users are active immediately after registering.
  A real system would send a confirmation email first.


 ## Tradeoffs and Design Decisions

- **Kept controllers simple over using a service layer.** A service layer 
  between controllers and models is a good practice in large apps. Here 
  it would have added extra files without adding much clarity given the 
  scope of this project.

- **Manual validation over a library.** express-validator was skipped to 
  keep the code natural and easy to read. Basic checks like checking if 
  fields exist cover what is needed here.

- **Mongoose over raw MongoDB driver.** Mongoose adds a small overhead 
  but the schema validation, pre-save hooks for password hashing, and 
  cleaner syntax made it the right choice here.

- **Role checking as middleware.** Instead of checking the role inside 
  every controller function, a reusable middleware handles it. This keeps 
  controllers focused only on business logic.


## What I Would Add With More Time

- **Pagination** on the records list so large datasets don't slow the API
- **Search** records by description keyword
- **Rate limiting** to prevent too many requests from one user
- **Unit tests** for controllers and middleware using Jest
- **Admin route** to manage users — activate, deactivate, change roles
- **Per user records** so each user only sees their own data by default
- **Token refresh** so users don't have to login again after 7 days