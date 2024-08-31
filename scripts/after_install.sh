#!/bin/bash
DIR="/home/ec2-user/monitor-prices-app"
echo "AfterInstall: Instalando dependências"
sudo chown -R ec2-user:ec2-user ${DIR}
cd ${DIR}
npm install
