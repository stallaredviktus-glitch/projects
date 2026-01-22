@echo off
echo === Deploying portfolio to 89.111.141.134 ===

set SERVER_IP=89.111.141.134
set SERVER_USER=root
set REMOTE_PATH=/var/www/portfolio

echo.
echo Step 1: Copying files to server...
echo (Enter password when prompted)
echo.

scp -r dist/* %SERVER_USER%@%SERVER_IP%:%REMOTE_PATH%/

echo.
echo Step 2: Configuring nginx on server...
echo (Enter password when prompted)
echo.

ssh %SERVER_USER%@%SERVER_IP% "mkdir -p /var/www/portfolio && cat > /etc/nginx/sites-available/portfolio << 'EOF'
server {
    listen 80;
    server_name _;
    root /var/www/portfolio;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control \"public, immutable\";
    }
}
EOF
ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/ && rm -f /etc/nginx/sites-enabled/default && nginx -t && systemctl reload nginx"

echo.
echo === Deploy complete! ===
echo Visit: http://%SERVER_IP%
pause
