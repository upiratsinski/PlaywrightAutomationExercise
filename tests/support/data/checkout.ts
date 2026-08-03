import { env } from '../config/env.ts';

export interface PaymentDetails {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

export interface OrderDetails {
  comment: string;
  payment: PaymentDetails;
}

export const orderData = {
  comment: 'Please deliver this test order carefully.',
};

export function createPaymentData(): PaymentDetails {
  return {
    nameOnCard: 'Luke Skywalker',
    cardNumber: env.paymentCardNumber,
    cvc: env.paymentCvc,
    expiryMonth: env.paymentExpiryMonth,
    expiryYear: env.paymentExpiryYear,
  };
}

export function createOrderData(): OrderDetails {
  return {
    comment: orderData.comment,
    payment: createPaymentData(),
  };
}
