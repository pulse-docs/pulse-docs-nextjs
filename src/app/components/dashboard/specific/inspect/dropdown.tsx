'use client';

import React, { useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function NumberDropdown() {
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const { replace } = useRouter();

    useEffect(() => {
        if (!searchParams.get('topK')) {
            const params = new URLSearchParams(searchParams);
            const defaultTopK = '50';
            params.set('topK', defaultTopK);
            replace(`${pathName}?${params.toString()}`);
        }
    }, [searchParams, pathName, replace]);

    const handleChange = useDebouncedCallback((value: string) => {
        console.log("handleChange", value);
        if (value === undefined) {
            return;
        }
        const params = new URLSearchParams(searchParams);

        if (value) {
            params.set('topK', value);
        } else {
            params.delete('topK');
        }
        replace(`${pathName}?${params.toString()}`);
    }, 500);

    const dropDownOptions = Array.from({ length: 48 }, (_, i) => i + 3).filter(value => value % 10 == 0);

    return (
        <div className="relative flex flex-1 flex-shrink-0">
            <label htmlFor="topK" className="sr-only">
                Select Number
            </label>
            <select
                id="topK"
                className="block w-full rounded-md border border-gray-200 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                defaultValue={searchParams.get('topK')?.toString() || '50'}
                onChange={(e) => handleChange(e.target.value)}
            >
                {dropDownOptions.map((value) => (
                    <option key={value} value={value}>
                        {value}
                    </option>
                ))}
            </select>
        </div>
    );
}
