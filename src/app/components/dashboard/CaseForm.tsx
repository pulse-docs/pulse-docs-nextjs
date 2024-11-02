"use client";
import { useState, useEffect } from 'react';
import { Box, Button, MenuItem, Select, InputLabel, FormControl, Typography, IconButton, Paper, TextField } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from "dayjs";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const initialCaseState = {
    state: 'DRAFT',
    history: '',
    recordsReviewed: [{ date: '', type: '', description: '' }],
    questions: [''],
    dueDate: dayjs().valueOf(),
    priority: 'standard'
};

export default function CaseForm({ onSubmit }: { onSubmit?: Function }) {
    const [caseData, setCaseData] = useState(initialCaseState);
    const router = useRouter();

    useEffect(() => {
        setCaseData(initialCaseState);
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
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

    function deleteRecord(index: number) {
        const updatedRecords = caseData.recordsReviewed.filter((_, i) => i !== index);
        setCaseData({ ...caseData, recordsReviewed: updatedRecords });
    }

    function addQuestion() {
        setCaseData({ ...caseData, questions: [...caseData.questions, ''] });
    }

    function deleteQuestion(index: number) {
        const updatedQuestions = caseData.questions.filter((_, i) => i !== index);
        setCaseData({ ...caseData, questions: updatedQuestions });
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (caseData.history && caseData.recordsReviewed.length > 0 && caseData.questions.length > 0) {
            caseData.state = 'READY_REVIEW';
        }
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

    const recordColumns: GridColDef[] = [
        { field: 'date', headerName: 'Date', flex: 1, editable: true },
        { field: 'type', headerName: 'Type', flex: 1, editable: true },
        { field: 'description', headerName: 'Description', flex: 2, editable: true },
        {
            field: 'actions', headerName: 'Actions', flex: 0.5, renderCell: (params: GridRenderCellParams) => (
                <IconButton edge="end" onClick={() => deleteRecord(params.row.id)}>
                    <DeleteIcon />
                </IconButton>
            )
        }
    ];

    const questionColumns: GridColDef[] = [
        { field: 'question', headerName: 'Question', flex: 2, editable: true },
        {
            field: 'actions', headerName: 'Actions', flex: 0.5, renderCell: (params: GridRenderCellParams) => (
                <IconButton edge="end" onClick={() => deleteQuestion(params.row.id)}>
                    <DeleteIcon />
                </IconButton>
            )
        }
    ];

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mx: 'auto' }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <FormControl fullWidth>
                    <InputLabel>State</InputLabel>
                    <Select
                        name="state"
                        value={caseData.state}
                        onChange={handleChange}
                    >
                        <MenuItem value="DRAFT">DRAFT</MenuItem>
                        <MenuItem value="READY_REVIEW">READY REVIEW</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                        name="priority"
                        value={caseData.priority}
                        onChange={handleChange}
                    >
                        <MenuItem value="standard">STANDARD</MenuItem>
                        <MenuItem value="rush">RUSH</MenuItem>
                        <MenuItem value="express">EXPRESS</MenuItem>
                    </Select>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label="Due Date"
                        value={dayjs(caseData.dueDate)}
                        onChange={(value) => setCaseData({ ...caseData, dueDate: value?.valueOf() ?? dayjs().valueOf() })}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                </LocalizationProvider>
            </Box>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h6">History</Typography>
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
            </Box>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h6">Records Reviewed</Typography>
                <Paper style={{ height: 300, width: '100%' }}>
                    <DataGrid
                        rows={caseData.recordsReviewed.map((record, index) => ({ id: index, ...record }))}
                        columns={recordColumns}
                        pageSizeOptions={[5]}
                        onCellEditCommit={(params) => handleRecordChange(params.id as number, params.field, params.value)}
                        components={{
                            Toolbar: () => (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                                    <Typography variant="h6">Records Reviewed</Typography>
                                    <IconButton color="primary" onClick={addRecord}>
                                        <AddIcon />
                                    </IconButton>
                                </Box>
                            )
                        }}
                    />
                </Paper>
            </Box>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h6">Questions</Typography>
                <Paper style={{ height: 300, width: '100%' }}>
                    <DataGrid
                        rows={caseData.questions.map((question, index) => ({ id: index, question }))}
                        columns={questionColumns}
                        pageSizeOptions={[5]}
                        onCellEditCommit={(params) => handleQuestionChange(params.id as number, params.value)}
                        components={{
                            Toolbar: () => (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                                    <Typography variant="h6">Questions</Typography>
                                    <IconButton color="primary" onClick={addQuestion}>
                                        <AddIcon />
                                    </IconButton>
                                </Box>
                            )
                        }}
                    />
                </Paper>
            </Box>
            <Button type="submit" variant="contained" color="primary">
                Create Case
            </Button>
        </Box>
    );
}