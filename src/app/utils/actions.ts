// 'use server'
// //import {connectClient} from './data';
// import {revalidatePath} from 'next/cache';
// import {redirect} from 'next/navigation';
// import {date, z} from 'zod';
// import { signIn } from '@/auth';
// import { AuthError } from 'next-auth';
//
// const FormSchema = z.object({
//     customerId: z.string({
//         invalid_type_error: 'Please select a customer.'
//     }),
//     amount: z.coerce
//         .number()
//         .min(0.01, {message: 'Amount must be at least $0.01'}),
//     status: z.enum(['pending', 'paid'], {
//         invalid_type_error: 'Please select a status.'
//     }),
//     date: z.string(),
//     id: z.number(),
// });
//
// export type State = {
//     errors?: {
//         customerId?: string[];
//         amount?: string[];
//         status?: string[];
//     };
//     message?: string | null;
// }
//
// const CreateInvoice = FormSchema.omit({id: true, date: true})
//
// // export async function createInvoice(prevState: State, formData: FormData) {
// //     // Validate the form data
// //     const validatedFields = CreateInvoice.safeParse({
// //         customerId: formData.get('customerId'),
// //         amount: formData.get('amount'),
// //         status: formData.get('status')
// //     });
//
// //     // If the form data is invalid, return an error message
// //     console.log('Before check ', validatedFields);
// //     if (!validatedFields.success) {
// //         return {
// //             errors: validatedFields.error.flatten().fieldErrors,
// //             message: 'Missing Fields or Invalid Data. Please check the form and try again.'
// //         };
// //     }
// //     console.log('After check ', validatedFields)
//
// //     // If the form data is valid, insert the invoice into the database
// //     const {customerId, amount, status} = validatedFields.data;
// //     const amountInCents = amount * 100;
// //     const date = new Date().toISOString().split('T')[0];
//
// //     // Connect to the database
// //     const client = await connectClient();
// //     try {
// //         await client.query(`
// //             INSERT INTO invoices (customer_id, amount, status, date)
// //             VALUES ($1, $2, $3, $4);
// //         `, [customerId, amountInCents, status, date]);
// //     } catch {
// //         throw new Error('Failed to create invoice.');
// //     } finally {
// //         client.end();
// //         revalidatePath('/dashboard/invoices');
// //         redirect('/dashboard/invoices')
// //     }
// // }
//
// const UpdateInvoice = FormSchema.omit({id: true, date: true});
//
// // export async function updateInvoice(id: string, prevState: State, formData: FormData) {
// //     const validatedFields = UpdateInvoice.safeParse({
// //         customerId: formData.get('customerId'),
// //         amount: formData.get('amount'),
// //         status: formData.get('status'),
// //     });
//
// //     if (!validatedFields.success) {
// //         return {
// //             errors: validatedFields.error.flatten().fieldErrors,
// //             message: 'Missing Fields or Invalid Data. Please check the form and try again.',
// //         };
// //     }
// //     const {customerId, amount, status} = validatedFields.data;
// //     const amountInCents = amount * 100;
// //     const client = await connectClient();
//
// //     try {
//
// //         await client.query(`
// //       UPDATE invoices
// //       SET customer_id = $2, amount = $3, status = $4
// //       WHERE id = $1;
// //     `, [id, customerId, amountInCents, status]);
// //     } catch (err) {
// //         console.error('Database Error:', err);
// //         throw new Error('Failed to update invoice.');
// //     } finally {
// //         client.end();
// //         revalidatePath('/dashboard/invoices');
// //         redirect('/dashboard/invoices');
// //     }
// // }
//
// // export async function deleteInvoice(id: string) {
// //     const client = await connectClient();
// //     try {
// //         await client.query(`
// //             DELETE FROM invoices
// //             WHERE id = $1;
// //         `, [id]);
// //     } catch {
// //         throw new Error('Failed to delete invoice.');
// //     } finally {
// //         client.end();
// //         revalidatePath('/dashboard/invoices');
// //     }
// // }
//
// export async function authenticate(
//     prevState: string | undefined,
//     formData: FormData,
// ) {
//     try {
//         await signIn('credentials', formData);
//     } catch (error) {
//         if (error instanceof AuthError) {
//             switch (error.type) {
//                 case 'CredentialsSignin':
//                     return 'Invalid credentials.';
//                 default:
//                     return 'Something went wrong.';
//             }
//         }
//         throw error;
//     }
// }
//
