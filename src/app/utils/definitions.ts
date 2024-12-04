// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type Case = {
  _id: string;
  file_id: string;
  claim_id: string;
  date_of_injury: string;
  extent_of_injury: string;
  method_of_injury: string;
  text: string;
  sections: {
    history: string;
    records: {
      date: string;
      description: string;
    }[];
  };
  questions: {
    number: number;
    question: string;
    subquestion: number;
    answer: string;
  }[];
  score: number;
  'text-embedding-3-small': number[];
  matches: number;
  matched: string[];
  treatment: string;
  mri_records: {
    date: string,
    record: string
    response: string
  }[]
};



export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type InvoiceStatusResult = {
  id: string;
  status: 'pending' | 'paid';
  paid: number;
  pending: number;
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type MatchField = {
  id: string;
  score: number;
  metadata?: MatchRecord
};

export type MatchRecord = {
  question: string;
  answer: string;
  file_name: string;
};

export type PineconeQueryResponse = {
  matches: MatchField[];
};
