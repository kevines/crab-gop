
#SFTP配置信息
#用户名
USER=root
#IP
IP=120.55.73.24
BCSJAR=./gop

echo "==========BCS 开始上传=============="
sftp -oPort=22 $USER@$IP<<EOF
put -r $BCSJAR /home/nginx/
EOF
echo "==========gop上传结束=============="
