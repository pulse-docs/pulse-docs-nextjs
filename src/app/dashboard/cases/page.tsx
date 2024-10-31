// src/app/dashboard/cases/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Box, Button } from '@mui/material';
import CaseForm from '../../components/dashboard/CaseForm';
import CaseList from '../../components/dashboard/CaseList';

export default function CasesPage() {
    const [cases, setCases] = useState([]);
    const [selectedCase, setSelectedCase] = useState(null);
    const router = useRouter();

    useEffect(() => {
        fetchCases();
    }, []);

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

    const handleDelete = async (id: string) => {
        await fetch(`/api/cases?id=${id}`, { method: 'DELETE' });
        await fetchCases();
    };

    const handleCreateCase = () => {
        router.push('/dashboard/cases/create');
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Manage Cases
            </Typography>
            <Box sx={{ mb: 4 }}>
                <Button variant="contained" color="primary" onClick={handleCreateCase}>
                    Create Case
                </Button>
            </Box>
            <CaseList cases={cases} onEdit={setSelectedCase} onDelete={handleDelete} />
        </Container>
    );
}