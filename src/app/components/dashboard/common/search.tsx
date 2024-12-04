'use client';

import { Search as SearchIcon } from '@mui/icons-material';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { TextField, InputAdornment } from '@mui/material';

export default function Search({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');

        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathName}?${params.toString()}`);
    }, 500);

    return (
        <TextField
            variant="outlined"
            placeholder={placeholder}
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams.get('query')?.toString()}
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                },
            }}
            fullWidth
        />
    );
}