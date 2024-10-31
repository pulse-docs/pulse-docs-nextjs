// /src/app/dashboard/create-cases/form.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Alert
} from '@mui/material';

export default function CaseForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({ created_by: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/cases/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ created_by: formData.created_by }),
            });

            if (!res.ok) throw new Error('Failed to create cases.');

            router.push('/dashboard/case'); // Redirect to dashboard on success
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
            <TextField
                label="Created By"
                name="created_by"
                value={formData.created_by}
                onChange={handleInputChange}
                required
                fullWidth
            />

            {error && <Alert severity="error">{error}</Alert>}

            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth
                startIcon={loading && <CircularProgress size={20} />}
            >
                {loading ? 'Creating...' : 'Create Case'}
            </Button>
        </Box>
    );
}