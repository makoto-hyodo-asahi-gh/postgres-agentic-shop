# ---- Step 1: Build the Vite React App ----
FROM node:22.14.0-slim AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
RUN npm install 

# Copy the rest of the application
COPY . .

# Build the application from .env.local file
RUN npm run build

# ---- Step 2: Serve with Nginx ----
FROM nginx:alpine

# Copy build files to Nginx's default directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose default HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
