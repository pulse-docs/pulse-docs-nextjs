"use client";

import { useState, useEffect } from 'react';
import { Typography, Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CaseCard from '@/app/components/dashboard/CaseCard';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

const initialCaseState = {
    guid: uuidv4().toString(),
    state: 'DRAFT',
    history: '',
    recordsReviewed: [],
    questions: [],
    dueDate: dayjs().valueOf(),
    priority: 'standard'
};

export default function CasesPage() {
    const [cases, setCases] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedCase, setSelectedCase] = useState(null);

    useEffect(() => {
        fetchCases();
    }, []);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const organization = JSON.parse(localStorage.getItem('organization') || '{}');
        const response = await fetch(`/api/users?orgCode=${organization?.orgCode}`);
        const data = await response.json();
        setUsers(data);
    };

    const fetchCases = async () => {
        const response = await fetch('/api/cases');
        const data = await response.json();
        setCases(data.body);
    };

    const handleCreateOrUpdate = async (caseData: any) => {
        const response = await fetch('/api/cases', {
            method: selectedCase ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(caseData),
        });
        await fetchCases();
        setSelectedCase(null);
    };

    const handleFieldChange = async (id: string, field: string, value: string) => {
        // This is weird. When upload/delete, call fetchCases
        if (id == "" || field == "" || value == "") {
            console.log('fetching cases');
            await fetchCases()
            return
        }

        await fetch(`/api/cases`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, [field]: value }),
        });
        await fetchCases();
    };

    const handleDelete = async (id: string) => {
        await fetch(`/api/cases?id=${id}`, { method: 'DELETE' });
        await fetchCases();
    };

    const handleCreateCase = async () => {
        await fetch('/api/cases', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(initialCaseState),
        });
        await fetchCases();
    };

    const handleEditCase = (id: string) => {
        console.log('Edit case:', id);
        // Navigate to the edit page if needed
    };

    return (
        <Box sx={{ mt: 4, flexGrow: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Manage Cases
            </Typography>
            <Box sx={{ mb: 4 }}>
                <Button variant="contained" color="primary" onClick={handleCreateCase}>
                    Create Case
                </Button>
            </Box>
            <Grid container spacing={4}>
                {cases.map((caseData) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={caseData.guid}>
                        <CaseCard
                            caseData={caseData}
                            users={users}
                            onEdit={handleEditCase}
                            onDelete={handleDelete}
                            onFieldChange={handleFieldChange}
                            fetchCases={fetchCases}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}