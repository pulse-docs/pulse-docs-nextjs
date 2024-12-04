'use client';
import React  from 'react';
import { ViewCase } from './buttons';
import { copyToClipboard } from '@/app/utils/data.clipboard';

export function MedicalCard({
  claim_id,
  score,
    matches,
    matched,
  extent_of_injury,
  method_of_injury,
  file_id,
  treatment,
    showTreatment
}: {
  claim_id: string,
  score: number,
  matches: number
  matched: string[],
  extent_of_injury: string,
  method_of_injury: string,
  file_id: string,
  treatment: string,
    showTreatment: boolean
}){
return (
<div className="flex flex-col justify-between w-full h-full overflow-hidden bg-white rounded-lg shadow-md hover:shadow-2xl hover:bg-gray-50 transform hover:scale-x-105 transition duration-300 ease-in-out md:max-w-md lg:max-w-lg">
  <div className="p-4">
    <div className="flex flex-col lg:flex-row justify-between items-start w-full">
    {/*  /!*<h2 className="text-xl font-bold text-gray-800">{claim_id}</h2>*!/*/}
    <p>Score: {Math.round(score * 100) / 100}</p>
    <p>Matches: {matches}</p>
    </div>
    <div>
      <div className="font-bold text-base text-gray-600">Extent of Injury</div>
      <p className="text-base text-gray-600 sm:text-sm md:text-base text-justify"
         onClick={() => copyToClipboard(extent_of_injury)} style={{cursor: 'pointer'}}>
        {extent_of_injury}
      </p>
    </div>
  </div>
  <div className="flex p-4 space-x-4 overflow-auto">
    <div className="flex flex-col justify-between flex-grow">
      <div>
        <div className="font-bold text-base text-gray-600">Method of Injury</div>
        <p className="text-sm text-gray-600 text-justify">{method_of_injury}</p>
      </div>
      { showTreatment ?
        <div>
          <h2 className="font-bold text-base text-gray-600 mt-2 overflow-scroll">Treatment</h2>
          <div className="mb-4">
            <p className="text-sm text-gray-600 text-justify">{treatment}</p>
          </div>
        </div> : null
      }

      <div>
        <h2 className="font-bold text-base text-gray-600 mt-2 overflow-scroll">Matched Sections</h2>
        {matched?.map((match, index) => (
            <div key={index} className="mb-4">
              <p className="text-sm text-gray-600 text-justify">{match}</p>
            </div>
        ))}
      </div>
      <ViewCase id={file_id}/>
    </div>
  </div>
</div>

);
};