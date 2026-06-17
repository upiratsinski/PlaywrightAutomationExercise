import dotenv from 'dotenv';

dotenv.config();

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}. Copy .env.example to .env and fill it in.`);
  }

  return value;
}

export const env = {
  baseUrl: getRequiredEnv('BASE_URL'),
  loginUsername: getRequiredEnv('LOGIN_USERNAME'),
  loginEmail: getRequiredEnv('LOGIN_EMAIL'),
  loginPassword: getRequiredEnv('LOGIN_PASSWORD'),
  invalidLoginEmail: getRequiredEnv('INVALID_LOGIN_EMAIL'),
  invalidLoginPassword: getRequiredEnv('INVALID_LOGIN_PASSWORD'),
  registrationPassword: getRequiredEnv('REGISTRATION_PASSWORD'),
  apiUserPassword: getRequiredEnv('API_USER_PASSWORD'),
  invalidApiLoginEmail: getRequiredEnv('INVALID_API_LOGIN_EMAIL'),
  invalidApiLoginPassword: getRequiredEnv('INVALID_API_LOGIN_PASSWORD'),
  paymentCardNumber: getRequiredEnv('PAYMENT_CARD_NUMBER'),
  paymentCvc: getRequiredEnv('PAYMENT_CVC'),
  paymentExpiryMonth: getRequiredEnv('PAYMENT_EXPIRY_MONTH'),
  paymentExpiryYear: getRequiredEnv('PAYMENT_EXPIRY_YEAR'),
};
