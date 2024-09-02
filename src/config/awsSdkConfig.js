// src/config/awsSdkConfig.js
const { SSM } = require('@aws-sdk/client-ssm');

// Cria uma instância do cliente SSM (Simple Systems Manager)
const ssm = new SSM({
  region: 'us-east-1'
});

module.exports = ssm;
