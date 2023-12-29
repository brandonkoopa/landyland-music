// src/aws/cognitoConfig.js
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import AWS from 'aws-sdk';

// Update AWS Config
AWS.config.region = 'us-east-1'; // e.g. us-east-1

// Cognito User Pool Config
const poolData = {
  UserPoolId : 'us-east-1_Ot5EYQS7f',
  ClientId : '63ss808t9tqjlkhh8rbe851qrc'
};

const userPool = new CognitoUserPool(poolData);

// Exporting the configured User Pool
export default userPool;
