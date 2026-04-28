FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Create non-root user
RUN addgroup -g nodejs && adduser -S -G nodejs node

# Copy source code
COPY --chown=nodejs:nodejs . .

# Build the application
RUN npm run build

# Create logs directory
RUN mkdir -p logs && chown nodejs:nodejs logs

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/api/v1/health || exit 1

# Switch to non-root user
USER nodejs

# Start the application
CMD ["npm", "start"]
