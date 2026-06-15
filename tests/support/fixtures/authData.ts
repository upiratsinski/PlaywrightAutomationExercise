import dotenv from 'dotenv';

const env = dotenv.config().parsed ?? {};

export const validLoginData = {
  validUsername: env.LOGIN_USERNAME ?? 'LukeSkywalker',
  validEmail: env.LOGIN_EMAIL ?? 'lukeskywalker.aqa@example.com',
  validPassword: env.LOGIN_PASSWORD ?? 'PlaywrightTest1234',
  contactUsSubject: 'Inquiry about services',
  contactUsMessage: 'Hello, I would like to know more about your services.',
};

export const loginUserProfileData = {
  firstName: 'Luke',
  lastName: 'Skywalker',
  company: 'Rebellion Inc.',
  address1: '123 Test St',
  address2: 'Apt 4B',
  country: 'Israel',
  state: 'Israel',
  city: 'Jerusalem',
  zipCode: '12345',
  mobileNumber: '+1234567890',
  birthDay: '1',
  birthMonth: 'January',
  birthYear: '2001',
};

export const invalidLoginData = {
  invalidUsername: 'InvalidUser',
  invalidEmail: env.INVALID_LOGIN_EMAIL ?? 'invalidlogintest@example.com',
  invalidPassword: env.INVALID_LOGIN_PASSWORD ?? 'Password123',
};

export const registrationData = {
  radiogender: 'Mr',
  registrationName: 'AnakinSkywalker',
  registrationEmail: `AnakinSkywalker-${Date.now()}@gmail.com`,
  registrationPassword: 'PlaywrightTest1234',
  registrationDateOfBirthDay: '1',
  registrationDateOfBirthMonth: 'January',
  registrationDateOfBirthYear: '2001',
  registrationFirstName: 'Anakin',
  registrationLastName: 'Skywalker',
  registrationCompany: 'Rebellion Inc.',
  registrationAddress1: '123 Test St',
  registrationAddress2: 'Apt 4B',
  registrationCountry: 'Israel',
  registrationState: 'Israel',
  registrationCity: 'jerusalem',
  registrationZipCode: '12345',
  registrationMobileNumber: '+1234567890',
};

export const contactUsData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  subject: 'Inquiry about services',
  message: 'Hello, I would like to know more about your services.',
  filePath: 'tests/support/fixtures/SampleFile.txt',
};

export const subscriptionData = {
  email: `subscription-${Date.now()}@example.com`,
};

export const productSearchData = {
  productName: 'Dress',
};

export const reviewData = {
  name: 'Luke Skywalker',
  email: 'luke.review@example.com',
  review: 'Great product for automation practice.',
};

export const orderData = {
  comment: 'Please deliver this test order carefully.',
};

export const paymentData = {
  nameOnCard: 'Luke Skywalker',
  cardNumber: '4111111111111111',
  cvc: '123',
  expiryMonth: '12',
  expiryYear: '2030',
};

export const cartProductData = {
  firstProduct: {
    id: 1,
    name: 'Blue Top',
    price: 'Rs. 500',
    quantity: '1',
    totalPrice: 'Rs. 500',
  },
  secondProduct: {
    id: 2,
    name: 'Men Tshirt',
    price: 'Rs. 400',
    quantity: '1',
    totalPrice: 'Rs. 400',
  },
};

export const brandData = {
  firstBrand: 'Polo',
  secondBrand: 'H&M',
};
