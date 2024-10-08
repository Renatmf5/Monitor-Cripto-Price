// src/services/parameterService.js
const ssm = require('../config/awsSdkConfig');

// Função para buscar um parâmetro específico do Parameter Store
async function getParameter(paramName) {
  try {
    const params = {
      Name: paramName,
      WithDecryption: false // Use true se o parâmetro estiver criptografado
    };

    const response = await // The `.promise()` call might be on an JS SDK v2 client API.
    // If yes, please remove .promise(). If not, remove this comment.
    ssm.getParameter(params);
    return response.Parameter.Value;
  } catch (error) {
    console.error(`Erro ao buscar o parâmetro ${paramName}:`, error.message);
    throw error;
  }
}

// Função para buscar múltiplos parâmetros
async function getParameters(paramNames) {
  try {
    const params = {
      Names: paramNames,
      WithDecryption: false // Use true se os parâmetros estiverem criptografados
    };

    const response = await // The `.promise()` call might be on an JS SDK v2 client API.
    // If yes, please remove .promise(). If not, remove this comment.
    ssm.getParameters(params);
    const values = {};
    response.Parameters.forEach(param => {
      values[param.Name] = param.Value;
    });
    return values;
  } catch (error) {
    console.error('Erro ao buscar os parâmetros:', error.message);
    throw error;
  }
}

module.exports = { getParameter, getParameters };
