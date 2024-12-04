'use client';
import { TextField, Box } from '@mui/material';

export default function TextArea({ value, cb }: { value: string, cb: Function }) {
    const handleChange = (e: any) => {
        cb(e.target.value);
    }

    return (
        <Box sx={{ width: '100%' }}>
            <TextField
                value={value}
                onChange={handleChange}
                placeholder="Paste history and records reviewed..."
                multiline
                rows={12}
                variant="outlined"
                fullWidth
            />
        </Box>
    );
}