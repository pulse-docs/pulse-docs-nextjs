'use client';
import React from 'react';

export async function Card({ title, description, link }: { title: string, description: string, link: string }) {
  return (
    <div className="flex flex-col max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <a href={link}>
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
      </a>
      <p className="mb-3 flex-grow font-normal text-gray-700 dark:text-gray-400">{description}</p>
      <a href={link} className="mt-auto inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Read more
        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
        </svg>
      </a>
    </div>
  );
}
// export async function Card({ title, description, link }: { title: string, description: string, link: string }){
//     return (
//     <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
//       <a href={link}>
//         <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
//       </a>
//       <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{description}</p>
//       <a href={link} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
//         Read more
//         <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
//           <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
//         </svg>
//       </a>
//     </div>
//   );
// }
// import React, { useState } from 'react';

// export function Card({ data }: { data: any }){
//   const [section, setSection] = useState('history');

//   const renderSection = () => {
//     switch (section) {
//       cases 'history':
//         return (
//           <p className="text-gray-700 dark:text-gray-400">
//             {data.sections['BRIEF HISTORY'].join(' ')}
//           </p>
//         );
//       cases 'records':
//         return (
//           <p className="text-gray-700 dark:text-gray-400">
//             {data.sections['RECORDS REVIEWED'].join(' ')}
//           </p>
//         );
//       cases 'questions':
//         return (
//           <p className="text-gray-700 dark:text-gray-400">
//             {data.sections['QUESTIONS'].join(' ')}
//           </p>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-10">
//       <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
//         {data.file_name}
//       </h5>
//       <p className="mb-4 text-gray-700 dark:text-gray-400">
//         <strong>File Key:</strong> {data.file_key}
//       </p>
//       <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
//         <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
//           <li className="mr-2">
//             <button
//               onClick={() => setSection('history')}
//               className={`inline-block p-4 rounded-t-lg border-b-2 ${section === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
//             >
//               History
//             </button>
//           </li>
//           <li className="mr-2">
//             <button
//               onClick={() => setSection('records')}
//               className={`inline-block p-4 rounded-t-lg border-b-2 ${section === 'records' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
//             >
//               Records Reviewed
//             </button>
//           </li>
//           <li className="mr-2">
//             <button
//               onClick={() => setSection('questions')}
//               className={`inline-block p-4 rounded-t-lg border-b-2 ${section === 'questions' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
//             >
//               Questions
//             </button>
//           </li>
//         </ul>
//       </div>
//       <div className="p-4">
//         {renderSection()}
//       </div>
//     </div>
//   );
// };
