//import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
//import InvoiceStatus from '@/app/ui/invoices/status';
//import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
//import { fetchFilteredInvoices } from '@/app/lib/data';
import { fetchMatchFileName, fetchTopK } from '@/app/utils/data.pinecone';

export default async function MatchesTable({
  query,
  currentPage,
  fname, 
}: {
  query: string;
  currentPage: number;
  fname: string;
}) {
  //const resp = await fetchTopK(query || '', 3);
  //console.log('fname', fname)
  //const resp = await fetchMatchFileName(query, fname);
  //console.log('TABLE ', resp.matches, 'query ', query, 'fname ', fname);
   return (<div></div>)
}
   //(
//     <div className="mt-6 flow-root">
//       <div className="inline-block min-w-full align-middle">
//           <h2 className="text-xl font-bold mb-4">{fname}</h2>
//         <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
//           <div className="md:hidden">
//             {resp.matches?.map((match) => (
//               <div
//                 key={match.id}
//                 className="mb-2 w-full rounded-md bg-white p-4"
//               >
//                 <div className="flex items-center justify-between border-b pb-4">
//                   <div>
//                     <div className="mb-2 flex items-center">
//                       {/* <Image
//                         src={invoice.image_url}
//                         className="mr-2 rounded-full"
//                         width={28}
//                         height={28}
//                         alt={`${invoice.name}'s profile picture`}
//                       />
//                       <p>{invoice.name}</p> */}
//                     </div>
//                     {/* <p className="text-sm text-gray-500">{invoice.email}</p> */}
//                   </div>
//                   {/* <InvoiceStatus status={invoice.status} /> */}
//                 </div>
//                 <div className="flex w-full items-center justify-between pt-4">
//                   <div>
//                     <p className="text-xl font-medium">
//                       {/* {formatCurrency(invoice.amount)} */}
//                       {match.metadata.question}
//                     </p>
//                     <p>{match.metadata.answer}</p>
//                   </div>
//                   <div className="flex justify-end gap-2">
//                     {/* <UpdateInvoice id={invoice.id} />
//                     <DeleteInvoice id={invoice.id} /> */}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <table className="hidden min-w-full text-gray-900 md:table">
//             <thead className="rounded-lg text-left text-sm font-normal">
//               <tr>
//                 <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
//                   Question
//                 </th>
//                 <th scope="col" className="px-3 py-5 font-medium">
//                   Anwer
//                 </th>
//                 <th scope="col" className="px-3 py-5 font-medium">
//                   Score
//                 </th>
//                 {/* <th scope="col" className="px-3 py-5 font-medium">
//                   Date
//                 </th>
//                 <th scope="col" className="px-3 py-5 font-medium">
//                   Status
//                 </th>
//                 <th scope="col" className="relative py-3 pl-6 pr-3">
//                   <span className="sr-only">Edit</span>
//                 </th> */}
//               </tr>
//             </thead>
//             <tbody className="bg-white">
//               {resp.matches?.map((match) => (
//                 <tr
//                   key={match.id}
//                   className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
//                 >
//                   <td className="text-pretty py-3 pl-6 pr-3">
//                     <div className="flex items-center gap-3 ">
//                       <p>{match.metadata.question}</p>
//                       {/* <Image
//                         src={invoice.image_url}
//                         className="rounded-full"
//                         width={28}
//                         height={28}
//                         alt={`${invoice.name}'s profile picture`}
//                       /> */}
//                       {/* <p>{invoice.name}</p> */}
//                     </div>
//                   </td>
//                   <td className="text-pretty py-3 pl-6 pr-3">
//                     <div className="flex items-center gap-3">
//                       <p>{match.metadata.answer}</p>
//                     </div>
//                   </td>
//                   <td className="text-pretty py-3 pl-6 pr-3">
//                     <div className="flex items-center gap-3">
//                       <p>{match.score}</p>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
