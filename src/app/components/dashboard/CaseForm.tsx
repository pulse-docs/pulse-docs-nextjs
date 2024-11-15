// src/app/components/dashboard/CaseForm.tsx
"use client";
import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    List, ListItem, ListItemIcon, ListItemText,
    Typography,
    TextField,
    Card,
    CardContent,
    CardActions,
    IconButton,
    DialogTitle, DialogContent, Dialog, DialogActions
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import  Grid  from '@mui/material/Grid2';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useRouter } from 'next/navigation';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';

// Initial case state
const initialCaseState = {
    guid: uuidv4().toString(),
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
    const [open, setOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const router = useRouter();

    useEffect(() => {
        if (id) fetchCaseData(id).then((data) => {setCaseData({...data, id: data._id})});
    }, [id]);

    useEffect(() => {
        if (!caseData.guid) {
            setError('GUID is required');
            setLoading(false);
            return;
        }
        fetchFiles();
    }, [caseData.guid]);

    const fetchFiles = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/upload?guid=${caseData.guid}`);
            if (!response.ok) {
                throw new Error(`Error fetching files: ${response.statusText}`);
            }

            const data = await response.json();
            setFiles(data.files || []);
            console.log("files", data.files);
        } catch (err) {
            console.error('Error fetching files:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
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

    const handleEditQuestion = (id, updatedQuestion) => {
        //console.log('handleEdit', id, updatedRecord);
        const updatedQuestions = caseData.questions.map(
            question => question.id === id ? updatedQuestion : question
        );
        setCaseData({ ...caseData, questions: updatedQuestions})
    }

    const handleEditResponse = (id, updatedQuestion) => {
        //console.log('handleEdit', id, updatedRecord);
        const updatedQuestions = caseData.questions.map(
            question => question.id === id ? updatedQuestion : question
        );
        setCaseData({ ...caseData, questions: updatedQuestions });
    }

    const handleDelete = (id) => {
        console.log('handleDelete', id);
        const updatedRecords = caseData.recordsReviewed.filter(record => record.id !== id);
        setCaseData({ ...caseData, recordsReviewed: updatedRecords });
    };

    const handleDeleteQuestion = (id) => {
        console.log('handleDelete', id);
        const updatedQuestions = caseData.questions.filter(question => question.id !== id);
        setCaseData({ ...caseData, questions: updatedQuestions });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const resp = await handleCreateOrUpdate(caseData);
        router.push('/dashboard/cases');
    }
    // Open the modal
    const handleClickOpen = () => {
        console.log('handleClickOpen');
        setOpen(true);
    };

    // Close the modal
    const handleClose = () => {
        setOpen(false);
        setUploadStatus(null); // Reset upload status on close
    };

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        Array.from(selectedFiles).forEach((file) => {formData.append('files', file)});
        formData.append('guid', caseData.guid);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            setUploadStatus(result.success ? 'Upload successful' : `Error: ${result.error}`);
            handleClose();
            fetchFiles();
        } catch (error) {
            setUploadStatus(`Upload failed: ${error.message}`);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            {/* Metadata Fields */}
            <MetadataSection caseData={caseData} handleChange={handleChange} handleClickOpen={handleClickOpen} open={open}/>
            <DialogModal open={open}
                             handleClose={handleClose}
                             handleFileChange={handleFileChange}
                            uploadStatus={uploadStatus}
                            handleUpload={handleUpload}
                            selectedFiles={selectedFiles}
                         maxWidth="sm" fullWidth />
            { files?.length ? <FileList files={files} />: null}
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
                    <QuestionCard question={question} onEdit={handleEditQuestion} onDelete={handleDeleteQuestion} />
                )}
            />

            {id ?
                <Button type="submit" variant="contained" onSubmit={handleCreateOrUpdate}>Update Case</Button>
                :
                <Button type="submit" variant="contained" onSubmit={handleCreateOrUpdate}>Submit Case</Button>
            }
        </Box>
    );
}

function FileList({files}){
    return (
        <Grid mb={2}>
            <Typography variant="h6">Files</Typography>
            <List>
                {files.map((file) => (
                    <ListItem key={file.key}>
                        <ListItemIcon>
                            <InsertDriveFileIcon />
                        </ListItemIcon>
                        <ListItemText primary={file.key} />
                        <IconButton edge="end" onClick={() => onDelete(file.key)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </Grid>
    );

}

// Metadata Section Component
function MetadataSection({ caseData, handleChange, handleClickOpen}) {
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
            <Grid size={{sm:12, md:4}}>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleClickOpen}
                >Upload</Button>
            </Grid>
        </Grid>
    );
}

function DialogModal({open, handleClose, handleFileChange, uploadStatus, handleUpload, selectedFiles}) {
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Upload Documents</DialogTitle>
            <DialogContent>
                <Typography>Select files to upload:</Typography>
                <input type="file" multiple onChange={handleFileChange} />
                {uploadStatus && <Typography>{uploadStatus}</Typography>}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
                <Button
                    onClick={handleUpload}
                    variant="contained"
                    color="primary"
                    disabled={!selectedFiles}
                >
                    Upload
                </Button>
            </DialogActions>
        </Dialog>
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
function QuestionCard({ question, onEdit, onDelete, onApprove, onAI }) {
    return (
        <Card>
            <CardContent>
                <TextField
                    fullWidth
                    label="Question"
                    value={question.question}
                    onChange={(e) => onEdit(question.id, { ...question, question: e.target.value })}
                    multiline
                    rows={2}
                />
                <TextField
                    fullWidth
                    label="Response"
                    value={question.response}
                    onChange={(e) => onEdit(question.id, { ...question, response: e.target.value })}
                    multiline
                    rows={1}
                    sx={{ mt: 2 }}
                />
            </CardContent>
            <CardActions sx={{ justifyContent: 'space-between' }}>
                <IconButton onClick={() => onDelete(question.id)}>
                    <DeleteIcon />
                </IconButton>
                <Box>
                    <Button onClick={() => onApprove(question.id)} variant="contained" color="primary" sx={{ mr: 1 }}>
                        Approve
                    </Button>
                    <Button onClick={() => onAI(question.id)} variant="contained" color="secondary">
                        AI
                    </Button>
                </Box>
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