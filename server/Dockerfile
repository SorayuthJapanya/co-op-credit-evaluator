# Build stage
FROM golang:1.25-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main cmd/api/main.go

# Final stage
FROM alpine:latest

# Install ca-certificates for HTTPS and tzdata for timezones
RUN apk --no-cache add ca-certificates tzdata

WORKDIR /root/

# Copy the binary from builder stage
COPY --from=builder /app/main .

# Accept PORT as an argument with default 10000
ARG PORT=10000
ENV PORT=$PORT

# Expose port (Render will set PORT env var, or overridden by arg)
EXPOSE $PORT

# Command to run the application
CMD ["./main"]
