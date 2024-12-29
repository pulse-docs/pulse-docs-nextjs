"use client";
import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    TextField,
    Grid,
    Drawer
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import InventoryIcon from '@mui/icons-material/Inventory';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import MedicalService from './services/medicalService';
import CaseQuestion from '@/app/components/dashboard/CaseQuestion';
import {v4 as uuidv4} from 'uuid';

async function fetchCase(guid: string) {
    const response = await fetch(`/api/cases?guid=${guid}`);
    if (!response.ok) {
        throw new Error('Failed to fetch case');
    }
    return (await response.json()).body;
}

async function fetchUsers() {
    if (localStorage.getItem('users') !== null) {
        return JSON.parse(localStorage.getItem('users') || '{}');
    }

    const organization = JSON.parse(localStorage.getItem('organization') || '{}');
    const response = await fetch(`/api/users?orgCode=${organization?.orgCode}`);
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    const userResp = await response.json();
    console.log('users', userResp);
    localStorage.setItem('users', JSON.stringify(userResp));
    return userResp;
}

async function fetchQuestions(caseGuid: string) {
    const response = await fetch(`/api/questions?caseGuid=${caseGuid}`);
    if (!response.ok) {
        throw new Error('Failed to fetch questions');
    }
    return (await response.json()).body;
}

export function CaseEdit({ guid }: { guid: string }) {
    const [caseData, setCaseData] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [files, setFiles] = useState<{ key: string, name: string }[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerItems, setDrawerItems] = useState<{ id: string, bucket: string, key: string, url: string }[]>([]);
    const [drawerWidth, setDrawerWidth] = useState<number>(400);
    const [questions, setQuestions] = useState<{ caseGuid: string, questionGuid: string, questionText: string, responseText: string }[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetchCase(guid).then((data) => setCaseData(data)).catch((error) => console.error(error));
    }, [guid]);

    useEffect(() => {
        fetchQuestions(guid).then((data) => setQuestions(data)).catch((error) => console.error(error));
    }, [guid]);

    useEffect(() => {
        fetchUsers().then((data) => setUsers(data)).catch((error) => console.error(error));
    }, []);

    const handleFieldChange = async (field: string, value: any) => {
        setCaseData((prevData: any) => ({ ...prevData, [field]: value }));
        await fetch(`/api/cases`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: caseData._id, [field]: value }),
        });
    };

    const handleDateChange = (date: any) => {
        handleFieldChange('dueDate', date);
    };

    const handlePriorityChange = (event: { target: { value: any; }; }) => {
        const newPriority = event.target.value;
        handleFieldChange('priority', newPriority);
        updateDueDate(newPriority);
    };

    const handleStateChange = (event: { target: { value: any; }; }) => {
        handleFieldChange('state', event.target.value);
    };

    const updateDueDate = (priority: any) => {
        const createdAtDate = new Date(caseData.createdAt);
        let dueDate;

        switch (priority) {
            case 'standard':
                dueDate = new Date(createdAtDate.getTime() + 72 * 60 * 60 * 1000); // 72 hours
                break;
            case 'rush':
                dueDate = new Date(createdAtDate.getTime() + 24 * 60 * 60 * 1000); // 24 hours
                break;
            case 'ludacris':
                dueDate = createdAtDate; // same date
                break;
            default:
                dueDate = createdAtDate;
        }

        handleFieldChange('dueDate', dueDate);
    };

    const handleAssigneeChange = (role: string, event: { target: { value: any; }; }) => {
        handleFieldChange(role, event.target.value);
    };

    const getUsersByRole = (role: string) => {
        if (!users.length){return []}
        return users.filter((user: any) => user.roles.includes(role));
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setUploadStatus(null); // Reset upload status on close
    };

    const handleFileChange = (e: { target: { files: any; }; }) => {
        const files = e.target.files;
        const invalidFiles = Array.from(files).filter((file: any) => file.type !== 'application/pdf');
        if (invalidFiles.length > 0) {
            setUploadStatus('Only PDF files are allowed');
            setSelectedFiles(null);
        } else {
            setUploadStatus(null);
            setSelectedFiles(files);
        }
    };

    const handleUpload = async () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        const formData = new FormData();
        Array.from(selectedFiles || []).forEach((file: any) => {
            formData.append('files', file);
        });
        formData.append('guidCase', caseData.guid);
        formData.append('uploadedBy', user.id);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            setUploadStatus('Upload successful');
            setFiles(result.files || []);
            handleClose();
        } catch (error) {
            setUploadStatus('Upload failed');
        }
    };

    const handleDeleteFile = async (guidCase: string, guidUpload: string, key: string) => {
        try {
            const encodedGuidCase = encodeURIComponent(guidCase);
            const encodedGuidUpload = encodeURIComponent(guidUpload);
            const encodedKey = encodeURIComponent(key);
            const response = await fetch(`/api/upload?guidCase=${encodedGuidCase}&guidUpload=${encodedGuidUpload}&key=${encodedKey}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                handleFieldChange('uploadDetails', caseData.uploadDetails.filter((upload: any) => upload.guidUpload !== guidUpload));
            } else {
                console.error('Error deleting file:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const handleInventoryClick = (caseGuid: string, uploadGuid: string) => {
        router.push(`/dashboard/services?caseGuid=${caseGuid}&uploadGuid=${uploadGuid}`);
    };

    const handleOpenDrawer = (items: { id: string, bucket: string, key: string, url: string }[]) => {
        setDrawerItems(items);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        setDrawerWidth(e.clientX);
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleAddQuestion = () => {
        const newQuestion = { caseGuid: guid, questionGuid: `${uuidv4().toString()}` , questionText: '', responseText: '' };
        fetch(`/api/questions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newQuestion),
        }).then((response) => {
            if (!response.ok) {
                console.error('Failed to create question:', response.statusText);
                return;
            }
            setQuestions([...questions, newQuestion]);
        })
    };

    const handleDeleteQuestion = (questionGuid: string) => {
        console.log('Delete question:', questionGuid);
        fetch(`/api/questions?guid=${questionGuid}`, { method: 'DELETE' })
            .then((response) => {
                if (!response.ok) {
                    console.error('Failed to delete question:', response.statusText);
                    return;
                }
                setQuestions(questions.filter(question => question.questionGuid !== questionGuid));
            })
    };

    const handleEditQuestion = (questionGuid: string, field: string, value: string) => {
        setQuestions(questions.map(question => {
            if (question.questionGuid === questionGuid) {
                return { ...question, [field]: value };
            }
            return question;
        }));
        fetch(`/api/questions`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ guid: questionGuid, [field]: value }),
        }).then((response) => {
            if (!response.ok) {
                console.error('Failed to update question:', response.statusText);
                return;
            }

        })
    }

    if (!caseData) {
        return <div>Loading...</div>;
    }

    return (
        <Box>
            <Typography variant="h6">{caseData.guid}</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                        <InputLabel>Priority</InputLabel>
                        <Select value={caseData.priority || 'standard'} onChange={handlePriorityChange}>
                            <MenuItem value="standard">Standard</MenuItem>
                            <MenuItem value="rush">Rush</MenuItem>
                            <MenuItem value="ludacris">Ludacris</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                        <InputLabel>State</InputLabel>
                        <Select value={caseData.state || 'Draft'} onChange={handleStateChange}>
                            <MenuItem value="Draft">Draft</MenuItem>
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
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Due Date"
                            value={dayjs(caseData.dueDate)}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                        <InputLabel>Analyst</InputLabel>
                        <Select value={caseData.analyst || ''} onChange={(e) => handleAssigneeChange('analyst', e)}>
                            {getUsersByRole('analyst').map((user: any) => (
                                <MenuItem key={user.id} value={user.id}>{user.full_name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                        <InputLabel>Reviewer</InputLabel>
                        <Select value={caseData.reviewer || ''} onChange={(e) => handleAssigneeChange('reviewer', e)}>
                            {getUsersByRole('reviewer').map((user: any) => (
                                <MenuItem key={user.id} value={user.id}>{user.full_name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                        <InputLabel>Approver</InputLabel>
                        <Select value={caseData.approver || ''} onChange={(e) => handleAssigneeChange('approver', e)}>
                            {getUsersByRole('approver').map((user: any) => (
                                <MenuItem key={user.id} value={user.id}>{user.full_name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Grid item xs={12} md={4}>
                        <Button variant="contained" color="primary" onClick={handleClickOpen}>
                            Upload Document
                        </Button>
                    </Grid>
                    <List>
                        {caseData.uploadDetails.map((upload: any, index: number) => (
                            <ListItem key={index}>
                                <ListItemIcon>
                                    <InsertDriveFileIcon />
                                </ListItemIcon>
                                <ListItemText primary={upload.filename} />
                                <IconButton edge="end" onClick={() => handleInventoryClick(caseData.guid, upload.guidUpload)}>
                                    <InventoryIcon />
                                </IconButton>
                                <IconButton edge="end" onClick={() => handleDeleteFile(caseData.guid, upload.guidUpload, upload.key)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body2">Medical Services:</Typography>
                    <Grid container spacing={2}>
                        {caseData.serviceDetails.map((service: any) => (
                            <Grid item xs={12} md={4} lg={3} key={service.id}>
                                <MedicalService
                                    id={service.id}
                                    info={service}
                                    items={service.items}
                                    medicalServices={caseData.serviceDetails}
                                    onOpenDrawer={handleOpenDrawer}
                                    disabled
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body2">Questions:</Typography>
                    <Button variant="contained" color="primary" onClick={handleAddQuestion}>
                        Add Question
                    </Button>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        {questions.map((question) => (
                            <Grid item xs={12}  md={4} lg={3} key={question.questionGuid}>
                                <CaseQuestion
                                    caseGuid={question.caseGuid}
                                    questionGuid={question.questionGuid}
                                    questionText={question.questionText}
                                    responseText={question.responseText}
                                    onDelete={handleDeleteQuestion}
                                    onInfoChange={handleEditQuestion}

                                />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Upload Documents</DialogTitle>
                <DialogContent>
                    <Typography>Select files to upload:</Typography>
                    <input type="file" multiple onChange={handleFileChange} />
                    {uploadStatus && <Typography>{uploadStatus}</Typography>}
                    <List>
                        {files.map((file: any) => (
                            <ListItem key={file.key}>
                                <ListItemIcon>
                                    <InsertDriveFileIcon />
                                </ListItemIcon>
                                <ListItemText primary={file.name} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpload} variant="contained" color="primary" disabled={!selectedFiles}>
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={handleCloseDrawer}
                PaperProps={{ style: { width: drawerWidth } }}
                ModalProps={{ keepMounted: true }}
                variant="persistent"
            >
                <Box sx={{ width: '100%', padding: 2, position: 'relative' }}>
                    <IconButton onClick={handleCloseDrawer} sx={{ mb: 2 }}>
                        <CloseIcon />
                    </IconButton>
                    <Box
                        sx={{
                            width: '5px',
                            height: '100%',
                            backgroundColor: 'gray',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            cursor: 'ew-resize',
                        }}
                        onMouseDown={handleMouseDown}
                    />
                    <Grid container spacing={2}>
                        {drawerItems.map((item, index) => (
                            <Grid size={{xs:12}} key={item.key}>
                                <img src={item.url} alt={`Page ${index + 1}`} style={{ width: '100%' }} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Drawer>
        </Box>
    );
}