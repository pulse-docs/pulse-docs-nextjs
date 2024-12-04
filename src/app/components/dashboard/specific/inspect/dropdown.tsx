'use client';

import React, { useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

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

    const dropDownOptions = Array.from({ length: 48 }, (_, i) => i + 3).filter(value => value % 10 === 0);

    return (
        <FormControl fullWidth variant="outlined">
            <InputLabel id="topK-label">Select Number</InputLabel>
            <Select
                labelId="topK-label"
                id="topK"
                defaultValue={searchParams.get('topK')?.toString() || '50'}
                onChange={(e) => handleChange(e.target.value)}
                label="Select Number"
            >
                {dropDownOptions.map((value) => (
                    <MenuItem key={value} value={value}>
                        {value}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}