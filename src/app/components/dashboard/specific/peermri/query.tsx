'use client';

import { Search as SearchIcon } from '@mui/icons-material';
import { TextField, InputAdornment, Box } from '@mui/material';
import { KeyboardEventHandler } from 'react';

interface QueryProps {
    placeholder: string;
    query: string;
    cb: (value: string) => void;
    handleSubmit: KeyboardEventHandler<HTMLDivElement>;
}

export default function Query({ placeholder, query, cb, handleSubmit }: QueryProps) {
    const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
        cb(e.target.value);
        autoExpand(e.target);
    };

    const autoExpand = (field: EventTarget & HTMLInputElement) => {
        field.style.height = 'inherit';
        const computed = window.getComputedStyle(field);
        const height = parseInt(computed.getPropertyValue('border-top-width'), 10)
            + parseInt(computed.getPropertyValue('padding-top'), 10)
            + field.scrollHeight
            + parseInt(computed.getPropertyValue('padding-bottom'), 10)
            + parseInt(computed.getPropertyValue('border-bottom-width'), 10);
        field.style.height = `${height}px`;
    };

    return (
        <Box sx={{ position: 'relative', flex: 1, flexShrink: 0 }}>
            <TextField
                placeholder={placeholder}
                value={query}
                onChange={handleQuery}
                onKeyDown={handleSubmit}
                multiline
                rows={2}
                variant="outlined"
                fullWidth
                slotProps={{
                    input: {startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    sx: { resize: 'none', overflow: 'hidden' }
                    }
                }}
            />
        </Box>
    );
}