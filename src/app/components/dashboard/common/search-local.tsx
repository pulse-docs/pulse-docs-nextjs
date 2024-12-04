'use client';

import { Search as SearchIcon } from '@mui/icons-material';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { TextField, InputAdornment } from '@mui/material';

export default function SearchLocal({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set('filter', term);
    } else {
      params.delete('filter');
    }
    replace(`${pathName}?${params.toString()}`);
  }, 500);

  return (
      <TextField
          variant="outlined"
          placeholder={placeholder}
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get('filter')?.toString()}
          slotProps={{
              input: {
                  startAdornment: (
                      <InputAdornment position="start">
                          <SearchIcon />
                      </InputAdornment>
                  ),
              }

          }}
          fullWidth
      />
  );
}