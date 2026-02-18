# ระบบประเมินความสามารถในการชำระหนี้ (Credit Evaluator System)

A comprehensive credit evaluation system built with modern web technologies, designed to assess and manage credit applications efficiently.

## 🏗️ Architecture Overview

This project follows a monorepo structure with separate client and server applications:

```
co-op-credit-evaluator/
├── client/                 # React frontend application
├── server/                 # Go backend API
└── README.md              # This file
```

## 🚀 Tech Stack

### Frontend (Client)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **UI Components**: shadcn/ui with Lucide icons
- **Notifications**: SweetAlert2
- **Package Manager**: pnpm

### Backend (Server)
- **Language**: Go
- **Framework**: Gin (implied from structure)
- **Authentication**: JWT tokens with refresh mechanism
- **API Documentation**: (To be implemented)

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (latest version)
- **Go** (v1.21 or higher)
- **Git**

## 🛠️ Installation & Setup

### 1. Clone the Repository

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

### 4. Environment Configuration

#### Frontend Environment Variables

Create a `.env` file in the `client` directory:

```env
# API Configuration
VITE_BASE_URL="http://localhost:3000/api"

# Optional Configuration
VITE_API_TIMEOUT=10000
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=true
VITE_APP_VERSION=1.0.0
VITE_LOG_LEVEL=debug
```

#### Backend Environment Variables

Create a `.env` file in the `server` directory (copy from `.env.example`):

```env
# Add your backend environment variables here
# Refer to server/.env.example for required variables
```

## 🏃‍♂️ Running the Application

### Development Mode

#### Start Frontend

```bash
cd client
pnpm dev
```

The frontend will be available at `http://localhost:5173`

#### Start Backend

```bash
cd server
go run cmd/api/main.go
```

The API will be available at `http://localhost:3000`

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

## 🔐 Authentication & Security

### Features Implemented

- **JWT Authentication**: Secure token-based authentication
- **Token Refresh**: Automatic token renewal
- **CSRF Protection**: Cross-site request forgery protection
- **Input Validation**: Comprehensive form validation with Zod
- **Thai ID Validation**: Proper checksum validation for Thai national IDs
- **Rate Limiting**: Login attempt rate limiting
- **XSS Protection**: Input sanitization against XSS attacks
- **Secure Storage**: Session-based token storage

### Authentication Flow

1. User logs in with Thai ID and password
2. Server validates credentials and returns JWT tokens
3. Client stores tokens securely in sessionStorage
4. Automatic token refresh before expiration
5. Protected routes require valid authentication

## 📁 Project Structure

### Frontend Structure

```
client/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── form/         # Form components
│   │   ├── layout/       # Layout components
│   │   ├── share/        # Shared components
│   │   └── ui/          # Base UI components (shadcn/ui)
│   ├── contexts/          # React contexts
│   ├── features/          # Feature-based modules
│   ├── hooks/            # Custom React hooks
│   ├── layouts/          # Page layouts
│   ├── lib/              # Utility libraries
│   ├── pages/            # Page components
│   │   ├── auth/         # Authentication pages
│   │   └── protected/    # Protected route pages
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
├── internal/             # Private application code
│   ├── controllers/      # HTTP handlers
│   ├── database/         # Database layer
│   └── middlewares/      # HTTP middlewares
├── go.mod
└── go.sum
```

## 🎯 Core Features

### User Management
- User registration with Thai ID validation
- Secure login with rate limiting
- User profile management
- Role-based access control

### Credit Evaluation
- Credit application processing
- Risk assessment algorithms
- Decision management
- Report generation

### Dashboard & Analytics
- Real-time dashboard
- Application statistics
- Performance metrics
- Data visualization

## 🧪 Testing

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

This project is licensed under the [License Name] - see the [LICENSE](LICENSE) file for details.

## 👥 Team & Credits

- **Development Team**: [Team Name/Individual Names]
- **Project Lead**: [Lead Name]
- **UI/UX Design**: [Designer Name]
- **Special Thanks**: [Contributors/Special Thanks]

## 📞 Support & Contact

- **Email**: support@example.com
- **Documentation**: [Link to docs]
- **Issues**: [Link to issue tracker]
- **Discussions**: [Link to discussions]

---

**Note**: This is a financial application handling sensitive user data. Ensure all security best practices are followed and comply with relevant data protection regulations.