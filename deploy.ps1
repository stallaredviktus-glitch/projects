$serverHost = "89.111.141.134"
$user = "root"
$localPath = "C:\Users\stallared\prijects\web_projects\portfolio\*"
$remotePath = "/var/www/portfolio/"

Write-Host "Uploading files to $user@$serverHost..."
scp -r $localPath "${user}@${serverHost}:$remotePath"

Write-Host "Fixing permissions and restarting nginx..."
ssh "${user}@${serverHost}" "chown -R www-data:www-data /var/www/portfolio && chmod -R o+rX /var/www/portfolio && systemctl restart nginx"

Write-Host "Done."
