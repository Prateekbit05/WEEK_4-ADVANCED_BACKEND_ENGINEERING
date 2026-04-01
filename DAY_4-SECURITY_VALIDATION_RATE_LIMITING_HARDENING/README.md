# Week 4 — Day 4: Security, Validation, Rate Limiting & Hardening

## 🎯 Objective
Secure and harden a production REST API by preventing common vulnerabilities, adding request validation, rate limiting, and global security middleware.

---

## 📚 Topics Covered

- Preventing NoSQL Injection, XSS, and Parameter Pollution
- JOI / Zod validation schemas for User and Product
- Helmet security headers
- CORS policy configuration
- Rate limiting with `express-rate-limit`
- Payload size limits
- Manual security test cases via Postman

---

## 🧪 Exercise

Built robust validation schemas for User and Product, added global security middleware (Helmet, CORS, rate limiting, payload limits), and manually tested vulnerabilities using Postman.

---

## 📁 Folder Structure

```
DAY_4-SECURITY_VALIDATION_RATE_LIMITING_HARDENING/
├── validate.js              # JOI/Zod validation schemas for User + Product
├── security.js              # Helmet, CORS, rate-limit, payload size middleware
├── SECURITY REPORT.md       # Vulnerabilities tested + results
└── screenshots/
    ├── POSTMAN_COMMANDS1.png
    ├── POSTMAN_COMMANDS2.png
    ├── POSTMAN_COMMANDS3.png
    ├── POSTMAN_COMMANDS4.png
    ├── POSTMAN_COMMANDS5.png
    ├── POSTMAN_COMMANDS6.png
    └── POSTMAN_COMMANDS7.png
```

---

## 🛡️ Security Middleware (`security.js`)

### Helmet — HTTP Security Headers
```js
app.use(helmet());
// Sets: X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security, etc.
```

### CORS Policy
```js
app.use(cors({
  origin: ["https://yourdomain.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
```

### Rate Limiting
```js
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // Max 100 requests per window
  message: { success: false, message: "Too many requests, please try again later." }
});
app.use("/api", limiter);
```

### Payload Size Limit
```js
app.use(express.json({ limit: "10kb" }));
// Rejects requests with body larger than 10kb
```

---

## ✅ Validation Schema (`validate.js`)

### User Validation
```js
// Fields: name, email, password, role
// - email: valid format, required
// - password: min 8 chars, must include uppercase + number
// - role: enum ["user", "admin"]
```

### Product Validation
```js
// Fields: title, description, price, category, tags
// - price: number, min 0
// - title: required, max 100 chars
// - tags: array of strings
```

---

## 🔐 Vulnerabilities Tested

| Vulnerability | Method | Result |
|---------------|--------|--------|
| NoSQL Injection | `{ "$gt": "" }` in login body | ✅ Blocked by validation |
| XSS Attack | Script tags in input fields | ✅ Sanitized by Helmet + validation |
| Parameter Pollution | Duplicate query params | ✅ Handled by sanitization |
| Oversized Payload | Body > 10kb | ✅ Rejected with 413 error |
| Rate Limit Exceeded | 100+ requests in 15 min | ✅ Blocked with 429 error |
| Invalid CORS Origin | Request from unknown origin | ✅ Rejected by CORS policy |
| Missing Auth Header | Request without JWT | ✅ Rejected with 401 error |

---

## 📸 Screenshots — Postman Security Testing

### Test 1
![Postman Commands 1](./screenshots/POSTMAN_COMMANDS1.png)

### Test 2
![Postman Commands 2](./screenshots/POSTMAN_COMMANDS2.png)

### Test 3
![Postman Commands 3](./screenshots/POSTMAN_COMMANDS3.png)

### Test 4
![Postman Commands 4](./screenshots/POSTMAN_COMMANDS4.png)

### Test 5
![Postman Commands 5](./screenshots/POSTMAN_COMMANDS5.png)

### Test 6
![Postman Commands 6](./screenshots/POSTMAN_COMMANDS6.png)

### Test 7
![Postman Commands 7](./screenshots/POSTMAN_COMMANDS7.png)

---

## ✅ Deliverables

- [x] `validate.js` — JOI/Zod validation schemas for User and Product
- [x] `security.js` — Helmet, CORS, rate limiting, payload size middleware
- [x] `SECURITY REPORT.md` — Vulnerabilities tested and results documented
- [x] Postman screenshots for all manual security test cases

---

## 💡 Key Learnings

- **Helmet:** Sets 11+ HTTP security headers in one line — prevents clickjacking, MIME sniffing, and more
- **Rate limiting:** Protects against brute force and DDoS by capping requests per IP per time window
- **Payload limits:** Rejecting oversized bodies prevents memory exhaustion attacks
- **NoSQL Injection:** Mongoose operators like `$gt` in request bodies can bypass auth — validation schemas block this at the entry point
- **XSS:** Sanitizing and validating all string inputs before processing prevents script injection
- **CORS:** Whitelisting allowed origins ensures only trusted frontends can communicate with the API
