#!/bin/bash
DIR="/home/ec2-user/monitor-prices-app"

echo "ApplicationStart: Iniciando a aplicação"

# Conceder permissões
sudo chmod -R 777 ${DIR}

# Navegar para o diretório da aplicação
cd ${DIR}

# Executar o comando npm start em segundo plano e redirecionar a saída
nohup npm start > /dev/null 2>&1 &
