// src/app/components/dashboard/CaseForm.tsx
"use client";
import { useState, useEffect } from 'react';
import { Box, Button, MenuItem, Select, InputLabel, FormControl, Typography,  TextField, Card, CardContent, CardActions, IconButton } from '@mui/material';
import  Grid  from '@mui/material/Grid2';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useRouter } from 'next/navigation';
import DeleteIcon from '@mui/icons-material/Delete';

// Initial case state
const initialCaseState = {
    state: 'DRAFT',
    history: '',
    recordsReviewed: [],
    questions: [],
    dueDate: dayjs().valueOf(),
    priority: 'standard'
};




async function fetchCaseData(id: string) {
    const response = await fetch(`/api/cases?id=${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch case data');
    }
    return (await response.json()).body;
}

// Main CaseForm component
export default function CaseForm({ onSubmit, id }: { onSubmit?: Function, id?: string }) {
    const [caseData, setCaseData] = useState(initialCaseState);
    const router = useRouter();

    useEffect(() => {
        if (id) fetchCaseData(id).then((data) => {setCaseData({...data, id: data._id})});
    }, [id]);

    const handleCreateOrUpdate = async (caseData: any) => {
        const response = await fetch('/api/cases', {
            method: caseData._id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(caseData),
        });
    };

    const handleChange = (e) => setCaseData({ ...caseData, [e.target.name]: e.target.value });
    //const addRecord = () => setCaseData({ ...caseData, recordsReviewed: [...caseData.recordsReviewed, { id: Date.now(), date: '', type: '', description: '' }] });
    const addQuestion = () => setCaseData({ ...caseData, questions: [...caseData.questions, { id: Date.now(), question: '' }] });

    const addRecord = () => {
        setCaseData({
            ...caseData,
            recordsReviewed: [
                ...caseData.recordsReviewed,
                { id: Date.now(), date: dayjs(), type: '', description: '' }
            ]
        });
    };




    // Function handlers in the parent component
    const handleDateChange = (id, newDate) => {
        const updatedRecords = caseData.recordsReviewed.map(
            record => record.id === id ? { ...record, date: newDate } : record
        );
        setCaseData({ ...caseData, recordsReviewed: updatedRecords });
    };

    const handleTypeChange = (id, newType) => {
        //console.log('handleTypeChange', id, newType);
        const updatedRecords = caseData.recordsReviewed.map(
            record => record.id === id ? { ...record, type: newType } : record
        );
        setCaseData({ ...caseData, recordsReviewed: updatedRecords });
    };

    const handleEdit = (id, updatedRecord) => {
        //console.log('handleEdit', id, updatedRecord);
        const updatedRecords = caseData.recordsReviewed.map(
            record => record.id === id ? updatedRecord : record
        );
        setCaseData({ ...caseData, recordsReviewed: updatedRecords });
    };

    const handleDelete = (id) => {
        console.log('handleDelete', id);
        const updatedRecords = caseData.recordsReviewed.filter(record => record.id !== id);
        setCaseData({ ...caseData, recordsReviewed: updatedRecords });
    };

    async function handleSubmit(e) {
        e.preventDefault();
        const resp = await handleCreateOrUpdate(caseData);
        router.push('/dashboard/cases');
    }

    return (
        <Box component="form" onSubmit={handleSubmit}>
            {/* Metadata Fields */}
            <MetadataSection caseData={caseData} handleChange={handleChange} />

            {/* Records Section */}
            <CardGrid
                title="Records Reviewed"
                items={caseData.recordsReviewed}
                onAddItem={addRecord}
                renderItem={(record) => (
                    <RecordCard record={record} onDateChange={handleDateChange} onTypeChange={handleTypeChange} onEdit={handleEdit} onDelete={handleDelete} />
                )}
            />

            {/* Questions Section */}
            <CardGrid
                title="Questions"
                items={caseData.questions}
                onAddItem={addQuestion}
                renderItem={(question) => (
                    <QuestionCard question={question} onEdit={() => {}} onDelete={() => {}} />
                )}
            />

            <Button type="submit" variant="contained" onSubmit={handleCreateOrUpdate}>Submit Case</Button>
        </Box>
    );
}

// Metadata Section Component
function MetadataSection({ caseData, handleChange }) {
    return (
        <Grid container spacing={2} mb={2}>
            <Grid  size={{sm:12, md:4}}>
                <FormControl fullWidth>
                    <InputLabel>State</InputLabel>
                    <Select name="state" value={caseData.state} onChange={handleChange}>
                        <MenuItem value="DRAFT">DRAFT</MenuItem>
                        <MenuItem value="SUBMITTED">SUBMITTED</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid  size={{sm:12, md:4}}>
                <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select name="priority" value={caseData.priority} onChange={handleChange}>
                        <MenuItem value="standard">STANDARD</MenuItem>
                        <MenuItem value="rush">RUSH</MenuItem>
                        <MenuItem value="express">EXPRESS</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid  size={{sm:12, md:4}}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label="Due Date"
                        value={dayjs(caseData.dueDate)}
                        onChange={(value) => handleChange({ target: { name: 'dueDate', value: value?.valueOf() } })}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                </LocalizationProvider>
            </Grid>
        </Grid>
    );
}
// CardGrid Component
function CardGrid({ title, items, renderItem, onAddItem }) {
    return (
        <Box mb={2}>
            <Typography variant="h6">{title}</Typography>
            <Grid container spacing={2}>
                {items.map((item) => (
                    <Grid  key={item.id} size={{xs:12, sm:6,  md:4}}>
                        {renderItem(item)}
                    </Grid>
                ))}
                <Grid size={12}>
                    <Button onClick={onAddItem} startIcon={<AddIcon />}>Add New</Button>
                </Grid>
            </Grid>
        </Box>
    );
}

// RecordCard Component
function RecordCard({ record, onDateChange, onTypeChange, onEdit, onDelete }) {
    return (
        <Card>
            <CardContent>
                <Grid container spacing={2} mb={2}>
                    <Grid size={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Date"
                                value={dayjs(record.date)}
                                onChange={(newValue) => onDateChange(record.id, newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid size={6}>
                        <FormControl fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={record.type}
                                onChange={(e) => onTypeChange(record.id, e.target.value)}
                            >
                                <MenuItem value="Type1">Type1</MenuItem>
                                <MenuItem value="Type2">Type2</MenuItem>
                                <MenuItem value="Type3">Type3</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <TextField
                    fullWidth
                    label="Description"
                    value={record.description}
                    onChange={(e) => onEdit(record.id, { ...record, description: e.target.value })}
                    multiline
                />
            </CardContent>
            <CardActions>
                <IconButton onClick={() => onDelete(record.id)}>
                    <DeleteIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
}
// QuestionCard Component
function QuestionCard({ question, onEdit, onDelete }) {
    return (
        <Card>
            <CardContent>
                <Typography>Question: {question.question}</Typography>
            </CardContent>
            <CardActions>
                <Button onClick={() => onEdit(question)}>Edit</Button>
                <Button onClick={() => onDelete(question)}>Delete</Button>
            </CardActions>
        </Card>
    );
}

// ReferenceTag Component
function ReferenceTag({ onReference }) {
    return (
        <Button onClick={onReference} startIcon={<AddIcon />}>
            Reference
        </Button>
    );
}