# ระบบประเมินความสามารถในการชำระหนี้ (Credit Evaluator System)

ระบบประเมินสินเชื่อที่ครบวงจร สร้างด้วยเทคโนโลยีสมัยใหม่ ออกแบบมาเพื่อประเมินและจัดการคำขอสินเชื่ออย่างมีประสิทธิภาพ

## 🏗️ โครงสร้างระบบ

โปรเจคนี้ใช้โครงสร้าง Monorepo ที่แยกระหว่างแอปพลิเคชัน Frontend และ Backend:

```
co-op-credit-evaluator/
├── client/                 # React frontend application
├── server/                 # Go backend API
└── README.md              # This file
```

## 🚀 เทคโนโลยีที่ใช้

### Frontend (Client)
- **Framework**: React 19 พร้อม TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **UI Components**: shadcn/ui พร้อม Lucide icons
- **Notifications**: SweetAlert2
- **Charts**: Recharts
- **Data Grid**: MUI X Data Grid
- **Package Manager**: pnpm

### Backend (Server)
- **Language**: Go 1.25.6
- **Framework**: Fiber v3
- **Database**: PostgreSQL พร้อม GORM
- **Authentication**: JWT tokens
- **Environment**: dotenv
- **Hot Reload**: Air

## 📋 ข้อกำหนดเบื้องต้น

ก่อนรันแอปพลิเคชัน ต้องติดตั้งสิ่งต่อไปนี้:

- **Node.js** (v18 หรือสูงกว่า)
- **pnpm** (เวอร์ชันล่าสุด)
- **Go** (v1.21 หรือสูงกว่า)
- **PostgreSQL** (สำหรับฐานข้อมูล)
- **Git**

## 🛠️ การติดตั้งและตั้งค่า

### 1. Clone Repository

```bash
git clone https://github.com/SorayuthJapanya/co-op-credit-evaluator.git
cd co-op-credit-evaluator
```

### 2. Frontend Setup

```bash
cd client
pnpm install
```

### 3. Backend Setup

```bash
cd server
go mod download
```

### 4. การตั้งค่า Environment Variables

#### Frontend Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์ `client`:

```env
# API Configuration
VITE_BASE_URL="http://localhost:8080/api"

# Optional Configuration
VITE_API_TIMEOUT=10000
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=true
VITE_APP_VERSION=1.0.0
VITE_LOG_LEVEL=debug
```

#### Backend Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์ `server` (คัดลอกจาก `.env.example`):

```env
ENV="development"
FRONTEND_URL="http://localhost:5173"
DB_DSN="host=localhost user=postgres password=yourpassword dbname=credit_evaluator port=5432 sslmode=disable TimeZone=Asia/Bangkok"
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters-long"
PORT="8080"
```

## 🏃‍♂️ การรันแอปพลิเคชัน

### Development Mode

#### Start Frontend

```bash
cd client
pnpm dev
```

Frontend จะพร้อมใช้งานที่ `http://localhost:5173`

#### Start Backend

```bash
cd server
go run cmd/api/main.go
# หรือใช้ Air สำหรับ hot reload
air
```

API จะพร้อมใช้งานที่ `http://localhost:8080`

### Production Build

#### Build Frontend

```bash
cd client
pnpm build
```

The built files will be in `client/dist/`

#### Build Backend

```bash
cd server
go build -o bin/api cmd/api/main.go
```

## การตรวจสอบสิทธิ์และความปลอดภัย

### ฟีเจอร์ที่ implement แล้ว

- **JWT Authentication**: การตรวจสอบสิทธิ์แบบ token-based
- **Thai ID Validation**: การตรวจสอบเลขบัตรประชาชนไทย
- **Input Validation**: การตรวจสอบข้อมูลฟอร์มด้วย Zod
- **Rate Limiting**: จำกัดครั้งในการ login
- **XSS Protection**: ป้องกัน XSS attacks
- **CORS Configuration**: ตั้งค่า CORS อย่างปลอดภัย

### การทำงานของ Authentication

1. User login ด้วยเลขบัตรประชาชนและรหัสผ่าน
2. Server ตรวจสอบ credentials และส่งคืน JWT tokens
3. Client เก็บ tokens ใน sessionStorage
4. Protected routes ต้องการการตรวจสอบสิทธิ์

## โครงสร้างโปรเจค

### Frontend Structure

```
client/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── form/         # Form components (ApplicantForm, CareerForm, etc.)
│   │   ├── layout/       # Layout components (Navbar, Sidebar)
│   │   ├── table/        # Table components (EvaluatesTable, MembersTable)
│   │   └── ui/          # Base UI components (shadcn/ui)
│   ├── contexts/          # React contexts
│   ├── hooks/            # Custom React hooks (useEvaluate, useAuth, etc.)
│   ├── layouts/          # Page layouts
│   ├── lib/              # Utility libraries
│   ├── pages/            # Page components
│   │   ├── auth/         # Authentication pages
│   │   └── protected/    # Protected route pages
│   │       ├── CreditEvaluatorPage.tsx
│   │       ├── AddCreditEvaluatorPage.tsx
│   │       └── EditCreditEvaluatorPage.tsx
│   ├── services/         # API service functions
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### Backend Structure

```
server/
├── cmd/                  # Application entry points
│   └── api/
│       └── main.go      # Main application entry
├── internal/             # Private application code
│   ├── controllers/      # HTTP handlers
│   │   ├── auth_controllers.go
│   │   ├── evaluate_controllers.go
│   │   ├── member_controllers.go
│   │   └── career_controllers.go
│   ├── database/         # Database layer
│   │   └── database.go
│   ├── middlewares/      # HTTP middlewares
│   ├── models/          # Data models
│   │   ├── auth_models.go
│   │   ├── evaluate_models.go
│   │   ├── member_models.go
│   │   └── career_models.go
│   ├── routes/          # Route definitions
│   │   ├── auth_routes.go
│   │   ├── evaluate_routes.go
│   │   ├── member_routes.go
│   │   └── routes.go
│   └── services/        # Business logic
│       ├── auth_services.go
│       ├── evaluate_services.go
│       ├── member_services.go
│       └── career_services.go
├── go.mod
└── go.sum
```

## ฟีเจอร์หลัก

### การจัดการผู้ใช้
- การลงทะเบียนผู้ใช้พร้อมการตรวจสอบเลขบัตรประชาชน
- การ login ที่ปลอดภัยพร้อม rate limiting
- การจัดการโปรไฟล์ผู้ใช้
- การควบคุมสิทธิ์ตามบทบาท

### การประเมินสินเชื่อ
- การประมวลผลคำขอสินเชื่อ
- การจัดการผู้สมัครหลายคนต่อการประเมิน
- การคำนวณความสามารถในการชำระหนี้
- การสร้างรายงานผลการประเมิน
- การจัดการข้อมูลอาชีพและรายได้

### แดชบอร์ดและการวิเคราะห์
- แดชบอร์ดแบบ real-time
- สถิติการประเมิน
- การแสดงผลข้อมูลด้วยกราฟ
- การวิเคราะห์ข้อมูลสมาชิก

### การจัดการข้อมูลสมาชิก
- การจัดการข้อมูลสมาชิกสหกรณ์
- การค้นหาและกรองข้อมูล
- การจัดการประเภทอาชีพ
- การแสดงข้อมูลสถิติต่างๆ

## Testing

### Frontend Testing

```bash
cd client
pnpm test          # Run unit tests
pnpm test:ui       # Run tests with UI
pnpm test:coverage  # Run tests with coverage
```

### Backend Testing

```bash
cd server
go test ./...       # Run all tests
go test -v ./...   # Run tests with verbose output
```

## 📝 Code Quality

### Linting

```bash
# Frontend
cd client
pnpm lint

# Backend
cd server
golangci-lint run
```

### Code Formatting

```bash
# Frontend
cd client
pnpm format

# Backend
cd server
go fmt ./...
```

## 🚀 Deployment

### Frontend Deployment

The frontend can be deployed to any static hosting service:

1. **Build for production**:
   ```bash
   cd client
   pnpm build
   ```

2. **Deploy `dist/` folder** to your hosting provider

### Backend Deployment

1. **Build the binary**:
   ```bash
   cd server
   go build -o bin/api cmd/api/main.go
   ```

2. **Run with proper environment variables**

3. **Consider using Docker** for containerized deployment

## 🤝 Contributing Guidelines

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** with proper testing
4. **Follow commit conventions**:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
5. **Push and create a pull request**

### Code Standards

- **TypeScript**: Strict mode enabled
- **React**: Functional components with hooks
- **Go**: Follow standard Go conventions
- **CSS**: Tailwind CSS utility classes
- **Commits**: Conventional commit format

### Pull Request Requirements

- [ ] Tests pass for all changes
- [ ] Code follows project style guidelines
- [ ] Documentation is updated if needed
- [ ] PR description clearly explains changes
- [ ] No breaking changes without proper versioning

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)

| Variable | Required | Default | Description |
|----------|-----------|----------|-------------|
| `VITE_BASE_URL` | Yes | - | Backend API URL |
| `VITE_API_TIMEOUT` | No | 10000 | API timeout in ms |
| `VITE_ENABLE_ANALYTICS` | No | false | Enable analytics tracking |
| `VITE_ENABLE_ERROR_REPORTING` | No | true | Enable error reporting |
| `VITE_APP_VERSION` | No | 1.0.0 | Application version |
| `VITE_LOG_LEVEL` | No | debug | Logging level |

## 🐛 Troubleshooting

### Common Issues

#### Frontend Issues

**Problem**: "VITE_BASE_URL is required"
- **Solution**: Ensure `.env` file exists in client directory with `VITE_BASE_URL` set

**Problem**: Thai ID validation fails
- **Solution**: Ensure exactly 13 digits with valid checksum

**Problem**: CORS errors
- **Solution**: Check backend CORS configuration and frontend API URL

#### Backend Issues

**Problem**: Database connection errors
- **Solution**: Verify database connection string and credentials

**Problem**: Port already in use
- **Solution**: Change port or kill existing process

### Getting Help

1. **Check the logs** for detailed error messages
2. **Search existing issues** in the repository
3. **Create a new issue** with:
   - Environment details
   - Error messages
   - Steps to reproduce
   - Expected vs actual behavior

## 📚 API Documentation

### Authentication Endpoints

#### POST `/auth/login-admin`
Login user with Thai ID and password

**Request Body**:
```json
{
  "username": "1234567890123",
  "password": "password"
}
```

**Response**:
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "refreshToken": "refresh_token_here",
  "expiresIn": 3600
}
```

#### POST `/auth/register-admin`
Register new user

#### GET `/protected/me`
Get current user information

#### POST `/protected/logout`
Logout current user

### Error Responses

All endpoints return consistent error format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Note**: This is a financial application handling sensitive user data. Ensure all security best practices are followed and comply with relevant data protection regulations.

## 📊 ฐานข้อมูล

### ตารางหลัก

- **users**: ข้อมูลผู้ใช้
- **evaluates**: ข้อมูลการประเมิน
- **applicants**: ข้อมูลผู้สมัครในการประเมิน
- **evaluate_results**: ผลการประเมิน
- **result_applicants**: ข้อมูลผู้สมัครในผลการประเมิน
- **career_categories**: ประเภทอาชีพ
- **sub_careers**: ประเภทอาชีพย่อย
- **members**: ข้อมูลสมาชิกสหกรณ์

## 🐛 การรายงานปัญหา

หากพบปัญหา กรุณารายงานที่:
1. GitHub Issues
2. ระบุข้อมูล: Environment, Steps to reproduce, Expected vs Actual behavior
3. แนบ screenshot ถ้าจำเป็น

## 📄 ใบอนุญาต

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 ทีมพัฒนา

- **Sorayuth Japanya** - Project Lead & Full Stack Developer

---

**ขอบคุณที่ใช้ระบบประเมินความสามารถในการชำระหนี้! 🙏**