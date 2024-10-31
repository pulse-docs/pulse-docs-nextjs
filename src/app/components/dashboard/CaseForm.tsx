"use client";
// src/components/dashboard/CaseForm.tsx
import { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

const initialCaseState = {
    title: '',
    description: '',
    state: 'DRAFT',
    history: '',
    recordsReviewed: [{ date: '', type: '', description: '' }],
    questions: ['']
};

export default function CaseForm({ onSubmit }: { onSubmit?: Function }) {
    const [caseData, setCaseData] = useState(initialCaseState);
    const router = useRouter();

    useEffect(() => {
        setCaseData(initialCaseState);
        //getOrgUsers()
    }, []);



    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | SelectChangeEvent) {
        const { name, value } = e.target;
        setCaseData({ ...caseData, [name]: value });
    }

    function handleRecordChange(index: number, field: string, value: string) {
        const updatedRecords = [...caseData.recordsReviewed];
        updatedRecords[index] = { ...updatedRecords[index], [field]: value };
        setCaseData({ ...caseData, recordsReviewed: updatedRecords });
    }

    function handleQuestionChange(index: number, value: string) {
        const updatedQuestions = [...caseData.questions];
        updatedQuestions[index] = value;
        setCaseData({ ...caseData, questions: updatedQuestions });
    }

    function addRecord() {
        setCaseData({ ...caseData, recordsReviewed: [...caseData.recordsReviewed, { date: '', type: '', description: '' }] });
    }

    function addQuestion() {
        setCaseData({ ...caseData, questions: [...caseData.questions, ''] });
    }

    async function getOrgUsers() {
        const response = await fetch('/api/org', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        console.log(response.json())
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log(caseData)
        if (onSubmit) {
            await onSubmit(caseData);
        } else {
            await fetch('/api/cases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(caseData),
            });
            router.push('/dashboard/cases');
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit}>
            {/*<TextField*/}
            {/*    label="Title"*/}
            {/*    name="title"*/}
            {/*    value={caseData.title}*/}
            {/*    onChange={handleChange}*/}
            {/*    fullWidth*/}
            {/*    sx={{ mb: 2 }}*/}
            {/*/>*/}
            {/*<TextField*/}
            {/*    label="Description"*/}
            {/*    name="description"*/}
            {/*    value={caseData.description}*/}
            {/*    onChange={handleChange}*/}
            {/*    fullWidth*/}
            {/*    sx={{ mb: 2 }}*/}
            {/*/>*/}
            {/*<FormControl fullWidth sx={{ mb: 2 }}>*/}
            {/*    <InputLabel>State</InputLabel>*/}
            {/*    <Select*/}
            {/*        name="state"*/}
            {/*        value={caseData.state}*/}
            {/*        onChange={handleChange}*/}
            {/*    >*/}
            {/*        <MenuItem value="DRAFT">DRAFT</MenuItem>*/}
            {/*        <MenuItem value="READY_FOR_REVIEW">READY REVIEW</MenuItem>*/}
            {/*        <MenuItem value="UNDER_REVIEW">UNDER REVIEW</MenuItem>*/}
            {/*        <MenuItem value="AWAITING_APPROVAL">AWAITING APPROVAL</MenuItem>*/}
            {/*        <MenuItem value="APPROVED">APPROVED</MenuItem>*/}
            {/*        <MenuItem value="REJECTED">REJECTED</MenuItem>*/}
            {/*    </Select>*/}
            {/*</FormControl>*/}
            <TextField
                label="History"
                name="history"
                value={caseData.history}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                sx={{ mb: 2 }}
            />
            <Box sx={{ mb: 2 }}>
                <Typography variant="h6">Records Reviewed</Typography>
                {caseData.recordsReviewed.map((record, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                        {/*<TextField*/}
                        {/*    label={`Record ${index + 1} Date`}*/}
                        {/*    value={record.date}*/}
                        {/*    onChange={(e) => handleRecordChange(index, 'date', e.target.value)}*/}
                        {/*    fullWidth*/}
                        {/*    sx={{ mb: 1 }}*/}
                        {/*/>*/}
                        {/*<TextField*/}
                        {/*    label={`Record ${index + 1} Type`}*/}
                        {/*    value={record.type}*/}
                        {/*    onChange={(e) => handleRecordChange(index, 'type', e.target.value)}*/}
                        {/*    fullWidth*/}
                        {/*    sx={{ mb: 1 }}*/}
                        {/*/>*/}
                        <TextField
                            label={`Record ${index + 1} Description`}
                            value={record.description}
                            onChange={(e) => handleRecordChange(index, 'description', e.target.value)}
                            fullWidth
                            multiline
                            rows={2}
                            sx={{ mb: 1 }}
                        />
                    </Box>
                ))}
                <Button variant="contained" color="secondary" onClick={addRecord}>Add Record</Button>
            </Box>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h6">Questions</Typography>
                {caseData.questions.map((question, index) => (
                    <TextField
                        key={index}
                        label={`Question ${index + 1}`}
                        value={question}
                        onChange={(e) => handleQuestionChange(index, e.target.value)}
                        fullWidth
                        multiline
                        rows={2}
                        sx={{ mb: 2 }}
                    />
                ))}
                <Button variant="contained" color="secondary" onClick={addQuestion}>Add Question</Button>
            </Box>
            <Button type="submit" variant="contained" color="primary">
                Create Case
            </Button>
        </Box>
    );
}