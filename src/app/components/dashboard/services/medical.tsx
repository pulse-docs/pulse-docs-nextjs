// src/app/components/medical/CreateMedicalService.tsx
import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { createService } from '@/app/lib/servicesCallbacks';

const MedicalService: React.FC = () => {
    const [type, setType] = useState('');
    const [summary, setSummary] = useState('');

    const handleCreate = async () => {
        const guid = uuidv4();
        const newService = { guid, type, summary, date: Date.now() };
        await createService(newService);
        setType('');
        setSummary('');
    };

    return (
        <Box>
            <TextField
                label="Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
            />
            <TextField
                label="Summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                fullWidth
                multiline
                rows={2}
                sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleCreate}>
                Create Medical Service
            </Button>
        </Box>
    );
};

export default MedicalService;