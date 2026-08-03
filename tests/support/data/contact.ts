import { resolve } from 'node:path';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  filePath: string;
}

export const contactUsData: ContactFormData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  subject: 'Inquiry about services',
  message: 'Hello, I would like to know more about your services.',
  filePath: resolve(process.cwd(), 'tests/support/data/SampleFile.txt'),
};
