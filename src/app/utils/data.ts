// import { Client } from 'pg';
// import {
//   CustomerField,
//   CustomersTableType,
//   InvoiceForm,
//   InvoicesTable,
//   InvoiceStatusResult,
//   LatestInvoiceRaw,
//   User,
//   Revenue,
// } from './definitions';
// import { formatCurrency } from './utils';
// import {unstable_noStore as noStore } from 'next/cache'

// export async function connectClient(){
//   const client = new Client({
//     host: process.env.POSTGRES_HOST,
//     port: Number(process.env.POSTGRES_PORT),
//     user: process.env.POSTGRES_USER,
//     password: process.env.POSTGRES_PASSWORD,
//     database: process.env.POSTGRES_DATABASE,
//   });
//   await client.connect();
//   return client
// }


// export async function fetchRevenue() {
//   // Add noStore() here to prevent the response from being cached.
//   // This is equivalent to in fetch(..., {cache: 'no-store'}).
//   noStore();
//   const client = await connectClient();
//   try {
//     // Artificially delay a response for demo purposes.
//     // Don't do this in production :)

//     // console.log('Fetching revenue data...');
//     // await new Promise((resolve) => setTimeout(resolve, 3000));

//     const data = await client.query<Revenue>(`SELECT * FROM revenue`);

//     // console.log('Data fetch completed after 3 seconds.');
//     return data.rows;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch revenue data.');
//   } finally {
//     client.end();
//   }

// }

// export async function fetchLatestInvoices() {
//   noStore();
//   const client = await connectClient();
//   try {
//     const data = await client.query<LatestInvoiceRaw>(`
//       SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
//       FROM invoices
//       JOIN customers ON invoices.customer_id = customers.id
//       ORDER BY invoices.date DESC
//       LIMIT 5`);

//     const latestInvoices = data.rows.map((invoice) => ({
//       ...invoice,
//       amount: formatCurrency(invoice.amount),
//     }));
//     return latestInvoices;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch the latest invoices.');
//   } finally {
//     client.end();
//   }

// }

// export async function fetchCardData() {
//   noStore();
//   const client = await connectClient();
//   try {
//     // You can probably combine these into a single SQL query
//     // However, we are intentionally splitting them to demonstrate
//     // how to initialize multiple queries in parallel with JS.
//     const invoiceCountPromise = client.query(`SELECT COUNT(*) FROM invoices`);
//     const customerCountPromise = client.query(`SELECT COUNT(*) FROM customers`);
//     const invoiceStatusPromise = client.query<InvoiceStatusResult>(`SELECT
//          SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
//          SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
//          FROM invoices`);

//     const data = await Promise.all([
//       invoiceCountPromise,
//       customerCountPromise,
//       invoiceStatusPromise,
//     ]);

//     const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
//     const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
//     const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
//     const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

//     return {
//       numberOfCustomers,
//       numberOfInvoices,
//       totalPaidInvoices,
//       totalPendingInvoices,
//     };
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch card data.');
//   } finally {
//     client.end();
//   }
// }

// const ITEMS_PER_PAGE = 6;
// export async function fetchFilteredInvoices(
//   query: string,
//   currentPage: number,
// ) {
//   noStore();
//   const client = await connectClient();
//   const offset = (currentPage - 1) * ITEMS_PER_PAGE;
//   const pattern = `%${query}%`; // Construct the pattern once and use it for all placeholders
//   const sqlQuery = `
//     SELECT
//       invoices.id,
//       invoices.amount,
//       invoices.date,
//       invoices.status,
//       customers.name,
//       customers.email,
//       customers.image_url
//     FROM invoices
//     JOIN customers ON invoices.customer_id = customers.id
//     WHERE
//       customers.name ILIKE $1 OR
//       customers.email ILIKE $1 OR
//       invoices.amount::text ILIKE $1 OR
//       invoices.date::text ILIKE $1 OR
//       invoices.status ILIKE $1
//     ORDER BY invoices.date DESC
//     LIMIT $2 OFFSET $3
//   `;
//   // Assuming `query` method accepts the SQL string followed by parameters
//   try {
//   const invoices = await client.query<InvoicesTable>(sqlQuery, [pattern, ITEMS_PER_PAGE, offset]);
//      return invoices.rows;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch invoices.');
//   } finally {
//     client.end();
//   }
// }


// export async function fetchInvoicesPages(query: string) {
//   noStore();
//   const client = await connectClient();
//   try {
//     const count = await client.query(`SELECT COUNT(*)
//     FROM invoices
//     JOIN customers ON invoices.customer_id = customers.id
//     WHERE
//       customers.name ILIKE $1 OR
//       customers.email ILIKE $1 OR
//       invoices.amount::text ILIKE $1 OR
//       invoices.date::text ILIKE $1 OR
//       invoices.status ILIKE $1
//   `, [`%${query}%`]);

//     const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
//     return totalPages;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch total number of invoices.');
//   } finally {
//     client.end();
//   }
// }

// export async function fetchInvoiceById(id: string) {
//   noStore();
//   const client = await connectClient();
//   console.log('id: ', id)
//   try {
//     const data = await client.query<InvoiceForm>(`
//       SELECT
//         invoices.id,
//         invoices.customer_id,
//         invoices.amount,
//         invoices.status
//       FROM invoices
//       WHERE invoices.id = $1;
//     `, [guid]);
    
//     console.log('rows: ', data.rows);
//     const invoice = data.rows.map((invoice) => ({
//       ...invoice,
//       // Convert amount from cents to dollars
//       amount: invoice.amount / 100,
//     }));
//     console.log(invoice)
//     return invoice[0];
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch invoice.');
//   } finally {
//     client.end();
//   }
// }

// export async function fetchCustomers() {
//   noStore();
//   const client = await connectClient();
//   try {
//     const data = await client.query<CustomerField>(`
//       SELECT
//         id,
//         name
//       FROM customers
//       ORDER BY name ASC
//     `);

//     const customers = data.rows;
//     return customers;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch all customers.');
//   } finally {
//     client.end();

//   }

// }

// export async function fetchFilteredCustomers(query: string) {
//   noStore();
//   const client = await connectClient();
//   const pattern = `%${query}%`;
//   try {
//     const data = await client.query<CustomersTableType>(`
// 		SELECT
// 		  customers.id,
// 		  customers.name,
// 		  customers.email,
// 		  customers.image_url,
// 		  COUNT(invoices.id) AS total_invoices,
// 		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
// 		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
// 		FROM customers
// 		LEFT JOIN invoices ON customers.id = invoices.customer_id
// 		WHERE
// 		  customers.name ILIKE $1 OR
//         customers.email ILIKE $1
// 		GROUP BY customers.id, customers.name, customers.email, customers.image_url
// 		ORDER BY customers.name ASC
// 	  `, [pattern]);

//     const customers = data.rows.map((customer) => ({
//       ...customer,
//       total_pending: formatCurrency(customer.total_pending),
//       total_paid: formatCurrency(customer.total_paid),
//     }));

//     return customers;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch customer table.');
//   }
// }

// export async function getUser(email: string) {
//   noStore();
//   const client = await connectClient();
//   try {
//     const user = await client.query(`SELECT * FROM users WHERE email=$1`, [email]);
//     return user.rows[0] as User;
//   } catch (error) {
//     console.error('Failed to fetch user:', error);
//     throw new Error('Failed to fetch user.');
//   } finally {
//     client.end();
//   }

// }
