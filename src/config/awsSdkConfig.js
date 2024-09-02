// src/config/awsSdkConfig.js
const AWS = require('aws-sdk');

// Configura o SDK para usar a região desejada
AWS.config.update({ region: process.env.AWS_REGION || 'us-east-1' });

// Cria uma instância do cliente SSM (Simple Systems Manager)
const ssm = new AWS.SSM();

module.exports = ssm;
