import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const DEFAULT_BASE_URL = 'https://automationexercise.com';

export const baseUrl = process.env.BASE_URL?.trim() || DEFAULT_BASE_URL;

export function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}. Copy .env.example to .env and fill it in.`);
  }

  return value;
}

export const env = {
  baseUrl,
  get registrationPassword(): string {
    return getRequiredEnv('REGISTRATION_PASSWORD');
  },
  get apiUserPassword(): string {
    return getRequiredEnv('API_USER_PASSWORD');
  },
  get paymentCardNumber(): string {
    return getRequiredEnv('PAYMENT_CARD_NUMBER');
  },
  get paymentCvc(): string {
    return getRequiredEnv('PAYMENT_CVC');
  },
  get paymentExpiryMonth(): string {
    return getRequiredEnv('PAYMENT_EXPIRY_MONTH');
  },
  get paymentExpiryYear(): string {
    return getRequiredEnv('PAYMENT_EXPIRY_YEAR');
  },
};
