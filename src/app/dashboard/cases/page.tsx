"use client";

import {useEffect, useState} from 'react';
import {Box, Button, Typography} from '@mui/material';
import Grid from '@mui/material/Grid2';
import CaseCard from '@/app/components/dashboard/CaseCard';
import {useRouter} from 'next/navigation';

import {CaseData, createCaseData} from "@/app/types/case";

export default function CasesPage() {
    const [cases, setCases] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedCase, setSelectedCase] = useState(null);
    const router = useRouter();

    useEffect(() => {
        fetchUsers().then(users => setUsers(users));

    }, [cases]);

    useEffect(() => {
        fetchCases();
    }, []);


    async function fetchUsers() {
        // Exists in local storage
        if (localStorage.getItem('users') !== null) {
            return JSON.parse(localStorage.getItem('users') || '{}');
        }
        // Must get users
        const organization = JSON   .parse(localStorage.getItem('organization') || '{}');
        // If organization does not have an orgCode, it is invalid
        if (!organization?.orgCode) {
            throw new Error('Failed to fetch users. No localStorage[organization]');
        }
        console.log('Fetching users');
        const response = await fetch(`/api/users?orgCode=${organization?.orgCode}`);
        if (!response.ok) {
            console.log(response);
            throw new Error('Failed to fetch users');
        }

        if (response.status !== 200) {
            console.log(response);
            throw new Error('Failed to fetch users');
        }

        const userResp = await response.json();
        localStorage.setItem('users', JSON.stringify(userResp));
        console.log(userResp);
        return userResp;
    }

    const fetchCases = async () => {
        const response = await fetch('/api/cases');
        const data = await response.json();
        console.log(data)
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

    const handleFieldChange = async (guid: string, field: string, value: string) => {
        // This is weird. When upload/delete, call fetchCases
        if (field == "" && value && "") {
            await fetchCases()
            return
        }

        console.log(`handleField Change: guid: ${guid}  field: ${field}  value: ${value}`);
        await fetch(`/api/cases`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ guid: guid, [field]: value }),
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
            body: JSON.stringify(createCaseData()),
        });
        await fetchCases();
    };

    const handleEditCase = (guid: string) => {
        console.log('Edit case:', guid);
        router.push(`/dashboard/cases/edit/${guid}`);
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
                {cases.map((caseData: CaseData) => (
                    <Grid size={{ md: 12, lg: 6, xl: 4 }} key={caseData.guid}>
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