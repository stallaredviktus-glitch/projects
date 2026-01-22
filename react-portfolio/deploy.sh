#!/bin/bash

# Deploy script for portfolio
# Usage: ./deploy.sh

SERVER_IP="89.111.141.134"
SERVER_USER="root"
REMOTE_PATH="/var/www/portfolio"

echo "=== Deploying portfolio to $SERVER_IP ==="

# 1. Build project (if not built)
if [ ! -d "dist" ]; then
    echo "Building project..."
    npm run build
fi

# 2. Copy files to server
echo "Copying files to server..."
scp -r dist/* ${SERVER_USER}@${SERVER_IP}:${REMOTE_PATH}/

# 3. Setup nginx config on server (first time only)
echo "Setting up nginx..."
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
# Create directory if not exists
mkdir -p /var/www/portfolio

# Create nginx config
cat > /etc/nginx/sites-available/portfolio << 'EOF'
server {
    listen 80;
    server_name _;
    root /var/www/portfolio;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload nginx
nginx -t && systemctl reload nginx

echo "Nginx configured!"
ENDSSH

echo ""
echo "=== Deploy complete! ==="
echo "Visit: http://$SERVER_IP"
