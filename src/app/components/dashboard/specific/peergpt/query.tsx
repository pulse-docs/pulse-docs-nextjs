'use client';

import { Search as SearchIcon } from '@mui/icons-material';

export default function Query({placeholder, query, cb, handleSubmit}: {
    placeholder: string,
    query: string,
    cb: Function,
    handleSubmit: Function
}) {
    const handleQuery = (e: any) => {
        console.log(e.target.value)
        cb(e.target.value);
    }

    return (
        <div className="relative flex flex-1 flex-shrink-0">
            <label htmlFor="search" className="sr-only">Query
            </label>
            <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 p-2"
                placeholder={placeholder}
                onChange={(e) => handleQuery(e)}
                onKeyDown={(e) => handleSubmit(e)}
                defaultValue={query}
            />
            <SearchIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
        </div>
    )
}