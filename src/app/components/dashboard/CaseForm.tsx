"use client";
import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    TextField,
    Card,
    CardContent,
    CardActions,
    IconButton,
    DialogTitle,
    DialogContent,
    Dialog,
    DialogActions,
    Grid
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useRouter } from 'next/navigation';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';

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

export default function CaseForm({ onSubmit, id }: { onSubmit?: Function, id?: string }) {
    const [caseData, setCaseData] = useState(initialCaseState);
    const [open, setOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [thumbnailURLs, setThumbnailURLs] = useState([]);

    const router = useRouter();

    useEffect(() => {
        if (id) fetchCaseData(id).then((data) => {
            setCaseData({ ...data, id: data._id });
        });
    }, [id]);

    useEffect(() => {
        if (!caseData.guid) {
            setError(null);
            setLoading(false);
            return;
        }
        fetchFiles();
    }, [caseData.guid]);

    useEffect(() => {
        if (!caseData.guid) {
            setError(null);
            setLoading(false);
            return;
        }
        fetchThumbnailURLs(caseData.guid).then((data) => {
            setThumbnailURLs(data.imageUrls);
        });
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
        } catch (err) {
            console.error('Error fetching files:', err);
            setError(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchThumbnailURLs = async (guid: string) => {
        const response = await fetch(`/api/pages?guid=${guid}`);
        if (!response.ok) {
            throw new Error('Failed to fetch thumbnail URLs');
        }
        return (await response.json());
    }

    const handleCreateOrUpdate = async (caseData: any) => {
        const response = await fetch('/api/cases', {
            method: caseData._id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(caseData),
        });
    };

    const handleChange = (e: { target: { name: any; value: any; }; }) => setCaseData({
        ...caseData,
        [e.target.name]: e.target.value
    });

    const addQuestion = () => setCaseData({
        ...caseData,
        questions: [...caseData.questions, { id: Date.now(), question: '' }]
    });

    const addRecord = () => {
        setCaseData({
            ...caseData,
            recordsReviewed: [
                ...caseData.recordsReviewed,
                { id: Date.now(), date: dayjs(), type: '', description: '' }
            ]
        });
    };

    const handleDateChange = (id: number, newDate: any) => {
        const updatedRecords = caseData.recordsReviewed.map(
            record => record.id === id ? { ...record, date: newDate } : record
        );
        setCaseData({ ...caseData, recordsReviewed: updatedRecords });
    };

    const handleTypeChange = (id: number, newType: any) => {
        const updatedRecords = caseData.recordsReviewed.map(
            record => record.id === id ? { ...record, type: newType } : record
        );
        setCaseData({ ...caseData, recordsReviewed: updatedRecords });
    };

    const handleEdit = (id: number, updatedRecord: any) => {
        const updatedRecords = caseData.recordsReviewed.map(
            record => record.id === id ? updatedRecord : record
        );
        setCaseData({ ...caseData, recordsReviewed: updatedRecords });
    };

    const handleEditQuestion = (id: number, updatedQuestion: any) => {
        const updatedQuestions = caseData.questions.map(
            question => question.id === id ? updatedQuestion : question
        );
        setCaseData({ ...caseData, questions: updatedQuestions });
    }

    const handleEditResponse = (id: number, updatedQuestion: any) => {
        const updatedQuestions = caseData.questions.map(
            question => question.id === id ? updatedQuestion : question
        );
        setCaseData({ ...caseData, questions: updatedQuestions });
    }

    const handleDelete = (id: number) => {
        const updatedRecords = caseData.recordsReviewed.filter(record => record.id !== id);
        setCaseData({ ...caseData, recordsReviewed: updatedRecords });
    };

    const handleDeleteQuestion = (id: number) => {
        const updatedQuestions = caseData.questions.filter(question => question.id !== id);
        setCaseData({ ...caseData, questions: updatedQuestions });
    }

    async function handleSubmit(e: { preventDefault: () => void; }) {
        e.preventDefault();
        const resp = await handleCreateOrUpdate(caseData);
        router.push('/dashboard/cases');
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setUploadStatus(null);
    };

    const handleFileChange = (e: { target: { files: any; }; }) => {
        setSelectedFiles(e.target.files);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        Array.from(selectedFiles).forEach((file) => {
            formData.append('files', file);
        });
        formData.append('guid', caseData.guid);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            setUploadStatus(null);
            handleClose();
            fetchFiles();
        } catch (error) {
            setUploadStatus(null);
        }
    };

    const handleDeleteFile = async (key: any) => {
        try {
            const response = await fetch(`/api/upload?key=${key}`, {
                method: 'DELETE',
            });

            const result = await response.json();
            setUploadStatus(null);
            fetchFiles();
        } catch (error) {
            setUploadStatus(null);
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <MetadataSection caseData={caseData} handleChange={handleChange} handleClickOpen={handleClickOpen} open={open} />
            <DialogModal open={open} handleClose={handleClose} handleFileChange={handleFileChange} uploadStatus={uploadStatus} handleUpload={handleUpload} selectedFiles={selectedFiles} />
            {files?.length ? <FileList files={files} onDeleteFile={handleDeleteFile} /> : null}
            {thumbnailURLs?.length ? <ImageGrid thumbnailURLs={thumbnailURLs} /> : null}
            <CardGrid title="Records Reviewed" items={caseData.recordsReviewed} onAddItem={addRecord} renderItem={(record: any) => (
                <RecordCard record={record} onDateChange={handleDateChange} onTypeChange={handleTypeChange} onEdit={handleEdit} onDelete={handleDelete} />
            )} />
            <CardGrid title="Questions" items={caseData.questions} onAddItem={addQuestion} renderItem={(question: any) => (
                <QuestionCard question={question} onEdit={handleEditQuestion} onDelete={handleDeleteQuestion} />
            )} />
            <Button type="submit" variant="contained">{id ? 'Update Case' : 'Submit Case'}</Button>
        </Box>
    );
}

function MetadataSection({ caseData, handleChange, handleClickOpen, open }) {
    return (
        <Grid container spacing={2} mb={2}>
            <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                    <InputLabel>State</InputLabel>
                    <Select name="state" value={caseData.state} onChange={handleChange}>
                        <MenuItem value="DRAFT">Draft</MenuItem>
                        <MenuItem value="Documents Uploaded">Documents Uploaded</MenuItem>
                        <MenuItem value="Pages Classified">Pages Classified</MenuItem>
                        <MenuItem value="Medical Summary Created">Medical Summary Created</MenuItem>
                        <MenuItem value="Questions Transcribed">Questions Transcribed</MenuItem>
                        <MenuItem value="Review In Progress">Review In Progress</MenuItem>
                        <MenuItem value="Review Completed">Review Completed</MenuItem>
                        <MenuItem value="Approval In Progress">Approval In Progress</MenuItem>
                        <MenuItem value="Approved">Approved</MenuItem>
                        <MenuItem value="Report Generated">Report Generated</MenuItem>
                        <MenuItem value="Report Emailed">Report Emailed</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select name="priority" value={caseData.priority} onChange={handleChange}>
                        <MenuItem value="standard">Standard</MenuItem>
                        <MenuItem value="rush">Rush</MenuItem>
                        <MenuItem value="ludacris">Ludacris</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Due Date"
                        value={dayjs(caseData.dueDate)}
                        onChange={(newValue) => handleChange({ target: { name: 'dueDate', value: newValue } })}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                    <InputLabel>Analyst</InputLabel>
                    <Select name="analyst" value={caseData.analyst} onChange={handleChange}>
                        {/* Add options for analysts */}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                    <InputLabel>Reviewer</InputLabel>
                    <Select name="reviewer" value={caseData.reviewer} onChange={handleChange}>
                        {/* Add options for reviewers */}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                    <InputLabel>Approver</InputLabel>
                    <Select name="approver" value={caseData.approver} onChange={handleChange}>
                        {/* Add options for approvers */}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body2">Uploads:</Typography>
                <List>
                    {caseData.uploadDetails.map((upload, index) => (
                        <ListItem key={index}>
                            <ListItemIcon>
                                <InsertDriveFileIcon />
                            </ListItemIcon>
                            <ListItemText primary={upload.filename} />
                            <IconButton edge="end" onClick={() => handleDeleteFile(upload.key)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" fullWidth onClick={handleClickOpen}>Upload</Button>
            </Grid>
        </Grid>
    );
}

function DialogModal({ open, handleClose, handleFileChange, uploadStatus, handleUpload, selectedFiles }) {
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Upload Documents</DialogTitle>
            <DialogContent>
                <Typography>Select files to upload:</Typography>
                <input type="file" multiple onChange={handleFileChange} />
                {uploadStatus && <Typography>{uploadStatus}</Typography>}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">Cancel</Button>
                <Button onClick={handleUpload} variant="contained" color="primary" disabled={!selectedFiles}>Upload</Button>
            </DialogActions>
        </Dialog>
    );
}

function FileList({ files, onDeleteFile }) {
    return (
        <Grid mb={2}>
            <Typography variant="h6">Files</Typography>
            <List>
                {files.map((file) => (
                    <ListItem key={file.key}>
                        <ListItemIcon>
                            <InsertDriveFileIcon />
                        </ListItemIcon>
                        <ListItemText primary={file.name} />
                        <IconButton edge="end" onClick={() => onDeleteFile(file.key)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </Grid>
    );
}

function ImageGrid({ thumbnailURLs }) {
    return (
        <Grid container spacing={2}>
            {thumbnailURLs.map((url, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <img src={url} style={{ width: '100%' }} alt="" />
                </Grid>
            ))}
        </Grid>
    );
}

function CardGrid({ title, items, renderItem, onAddItem }) {
    return (
        <Box mb={2}>
            <Typography variant="h6">{title}</Typography>
            <Grid container spacing={2}>
                {items?.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                        {renderItem(item)}
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <Button onClick={onAddItem} startIcon={<AddIcon />}>Add New</Button>
                </Grid>
            </Grid>
        </Box>
    );
}

function RecordCard({ record, onDateChange, onTypeChange, onEdit, onDelete }) {
    return (
        <Card>
            <CardContent>
                <Grid container spacing={2} mb={2}>
                    <Grid item xs={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Date"
                                value={dayjs(record.date)}
                                onChange={(newValue) => onDateChange(record.id, newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Type"
                            value={record.type}
                            onChange={(e) => onTypeChange(record.id, e.target.value)}
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <TextField
                    label="Description"
                    value={record.description}
                    onChange={(e) => onEdit(record.id, { ...record, description: e.target.value })}
                    fullWidth
                />
            </CardContent>
            <CardActions>
                <Button onClick={() => onDelete(record.id)} color="secondary">Delete</Button>
            </CardActions>
        </Card>
    );
}

function QuestionCard({ question, onEdit, onDelete }) {
    return (
        <Card>
            <CardContent>
                <TextField
                    label="Question"
                    value={question.question}
                    onChange={(e) => onEdit(question.id, { ...question, question: e.target.value })}
                    fullWidth
                />
                <TextField
                    label="Response"
                    value={question.response}
                    onChange={(e) => onEdit(question.id, { ...question, response: e.target.value })}
                    fullWidth
                />
            </CardContent>
            <CardActions>
                <Button onClick={() => onDelete(question.id)} color="secondary">Delete</Button>
            </CardActions>
        </Card>
    );
}