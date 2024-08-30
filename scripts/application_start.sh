DIR="/home/ec2-user/monitor-prices-app"
#!/bin/bash
echo "ApplicationStart: Iniciando a aplicação"
sudo chmod -R 777 ${DIR}
cd ${DIR}
npm start &
