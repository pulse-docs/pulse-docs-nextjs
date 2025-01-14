import {useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select,
    Typography
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import InventoryIcon from '@mui/icons-material/Inventory';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import {useRouter} from 'next/navigation';
import {CaseData} from '@/app/types/case';

import {DialogModal} from "@/app/components/dashboard/UploadModal";

interface User {
    id: string;
    full_name: string;
    roles: string[];
}

interface CaseCardProps {
    caseData: CaseData;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onFieldChange: (id: string, field: string, value: any) => void;
    fetchCases: () => void;
    users: User[];
}

export default function CaseCard({ caseData, onEdit, onDelete, onFieldChange, users, fetchCases }: CaseCardProps) {
    const [open, setOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [files, setFiles] = useState<{ key: string, name: string }[]>([]);
    const router = useRouter();
    console.log('CaseCard:', caseData);
    const handleDateChange = (date: any) => {
        onFieldChange(caseData.guidCase, 'dueDate', date);
    };

    const handlePriorityChange = (event: { target: { value: any; }; }) => {
        const newPriority = event.target.value;
        onFieldChange(caseData.guidCase, 'priority', newPriority);
        updateDueDate(newPriority);
    };

    const handleStateChange = (event: { target: { value: any; }; }) => {
        const newState = event.target.value;
        onFieldChange(caseData.guidCase, 'state', newState);
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

        onFieldChange(caseData.guidCase, 'dueDate', dueDate);
    };

    const handleAssigneeChange = (role: string, event: { target: { value: any; }; }) => {
        console.log(`Assignee change: ${caseData.guidCase}, ${role}, ${event.target.value}`);
        const newAssignee = event.target.value;
        onFieldChange(caseData.guidCase, role, newAssignee);
    };

    const getUsersByRole = (role: string) => {
        if (!users.length) return [];
        return users.filter((user: User) => user.roles.includes(role));
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setUploadStatus(null); // Reset upload status on close
        setSelectedFiles(null)
        fetchCases();
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

    // const handleUpload = async () => {
    //     const user = JSON.parse(localStorage.getItem('user') || '{}');
    //     console.log('selected files:',selectedFiles)
    //     const formData = new FormData();
    //     Array.from(selectedFiles || []).forEach((file: any) => {
    //         formData.append('files', file);
    //         handleUpload(file);
    //
    //         const chunkSize = 5 * 1024 * 1024; // 5MB
    //         const numChunks = Math.ceil(file.size / chunkSize);
    //         const uploadedParts: { ETag: string; PartNumber: number; }[] = [];
    //         console.log("numChunks:", numChunks);
    //         // Step 1: Initialize multipart upload
    //         return fetch("/api/upload-multipart", {
    //             method: "POST",
    //             body: JSON.stringify({ fileName: file.name, fileType: file.type }),
    //             headers: { "Content-Type": "application/json" },
    //         })
    //             .then((response) => response.json())
    //             .then(({ uploadId }) => {
    //                 let chain = Promise.resolve();
    //
    //                 // Step 2: Process chunks in a chain
    //                 for (let i = 0; i < numChunks; i++) {
    //                     chain = chain.then(() => {
    //                         const start = i * chunkSize;
    //                         const end = Math.min(start + chunkSize, file.size);
    //                         const fileChunk = file.slice(start, end);
    //
    //                         // Request pre-signed URL for the chunk
    //                         return fetch("/api/upload-part", {
    //                             method: "POST",
    //                             body: JSON.stringify({
    //                                 fileName: file.name,
    //                                 uploadId,
    //                                 partNumber: i + 1,
    //                             }),
    //                             headers: { "Content-Type": "application/json" },
    //                         })
    //                             .then((response) => response.json())
    //                             .then(({ url }) =>
    //                                 // Upload the chunk directly to S3
    //                                 fetch(url, {
    //                                     method: "PUT",
    //                                     body: fileChunk,
    //                                     headers: { "Content-Type": file.type },
    //                                 })
    //                             )
    //                             .then((uploadResponse) => {
    //                                 if (!uploadResponse.ok) {
    //                                     throw new Error(`Failed to upload chunk ${i + 1}`);
    //                                 }
    //
    //                                 // Collect ETag for completion
    //                                 const etag = uploadResponse.headers.get("ETag");
    //                                 if (etag) {
    //                                     uploadedParts.push({ ETag: etag, PartNumber: i + 1 });
    //                                     console.log(`Uploaded part ${i + 1}: ${etag}`);
    //                                 }
    //
    //                             });
    //                     });
    //                 }
    //                 console.log("Uploaded Parts:", uploadedParts);
    //                 // Step 3: Complete the upload after all chunks are processed
    //                 return chain.then(() =>
    //                     fetch("/api/upload-complete", {
    //                         method: "POST",
    //                         body: JSON.stringify({
    //                             fileName: file.name,
    //                             uploadId,
    //                             parts: uploadedParts,
    //                         }),
    //                         headers: { "Content-Type": "application/json" },
    //                     })
    //                 );
    //             });
    //     });
    //     // formData.append('guidCase', caseData.guidCase);
    //     // formData.append('uploadedBy', user.id);
    //     //
    //     // try {
    //     //     const response = await fetch('/api/upload', {
    //     //         method: 'POST',
    //     //         body: formData,
    //     //     });
    //     //
    //     //     const result = await response.json();
    //     //     setUploadStatus('Upload successful');
    //     //     setFiles(result.files || []);
    //     //     handleClose();
    //     // } catch (error) {
    //     //     setUploadStatus('Upload failed');
    //     // } finally {
    //     //     fetchCases();
    //     // }
    // };

    const handleDeleteFile = async (guidCase: string, guidUpload: string, key: string) => {
        try {
            console.log('Deleting file:', guidCase, guidUpload, key);
            const encodedGuidCase = encodeURIComponent(guidCase);
            const encodedGuidUpload = encodeURIComponent(guidUpload);
            const encodedKey = encodeURIComponent(key);
            const response = await fetch(`/api/upload?guidCase=${encodedGuidCase}&guidUpload=${encodedGuidUpload}&key=${encodedKey}`, {
                method: 'DELETE',
            });

            if (response.ok && caseData.uploadDetails) {
                onFieldChange(caseData.guidCase, 'uploadDetails', caseData.uploadDetails.filter(upload => upload.guidUpload !== guidUpload));
            } else {
                console.error('Error deleting file:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting file:', error);
        } finally {
            fetchCases();
        }
    };

    const handleInventoryClick = (caseGuid: string, uploadGuid: string) => {
        router.push(`/dashboard/services?caseGuid=${caseGuid}&uploadGuid=${uploadGuid}`);
    };

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="h6">{caseData.guidCase}</Typography>
                <Grid container spacing={2}>
                    <Grid size={{xs: 12, md:6 }}>
                        <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                            <InputLabel>Priority</InputLabel>
                            <Select
                                value={caseData.priority || 'standard'}
                                onChange={handlePriorityChange}
                            >
                                <MenuItem value="standard">Standard</MenuItem>
                                <MenuItem value="rush">Rush</MenuItem>
                                <MenuItem value="ludacris">Ludacris</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{xs: 12, md:6 }}>
                        <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                            <InputLabel>State</InputLabel>
                            <Select
                                value={caseData.state || 'Draft'}
                                onChange={handleStateChange}
                            >
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
                </Grid>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'top', gap: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label={'Due Date'}
                            value={dayjs(caseData.dueDate)}
                            onChange={handleDateChange}
                        />
                    </LocalizationProvider>
                </Box>
                <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <InputLabel>Analyst</InputLabel>
                    <Select
                        value={caseData.analyst || ''}
                        onChange={(e) => handleAssigneeChange('analyst', e)}
                    >
                        {getUsersByRole('analyst').map((user: User) => (
                            <MenuItem key={user.id} value={user.id}>{user.full_name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <InputLabel>Reviewer</InputLabel>
                    <Select
                        value={caseData.reviewer || ''}
                        onChange={(e) => handleAssigneeChange('reviewer', e)}
                    >
                        {getUsersByRole('reviewer').map((user: User) => (
                            <MenuItem key={user.id} value={user.id}>{user.full_name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <InputLabel>Approver</InputLabel>
                    <Select
                        value={caseData.approver || ''}
                        onChange={(e) => handleAssigneeChange('approver', e)}
                    >
                        {getUsersByRole('approver').map((user: User) => (
                            <MenuItem key={user.id} value={user.id}>{user.full_name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Typography variant="body2" sx={{ mt: 2 }}>Uploads:</Typography>
                <List>
                    {caseData.uploadDetails ? caseData.uploadDetails.map((upload, index) => (
                        <ListItem key={index}>
                            <ListItemIcon>
                                <InsertDriveFileIcon />
                            </ListItemIcon>
                            <ListItemText primary={upload.filename} />
                            <IconButton edge="end" onClick={() => handleInventoryClick(caseData.guidCase, upload.guidUpload)}>
                                <InventoryIcon />
                            </IconButton>
                            <IconButton edge="end" onClick={() => handleDeleteFile(caseData.guidCase, upload.guidUpload, upload.key)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    )): <div></div>}
                </List>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid size={{xs: 12, md:4 }}>
                        <Button variant="contained" color="primary" onClick={() => onEdit(caseData.guidCase)}>
                            Edit
                        </Button>
                    </Grid>
                    <Grid size={{md:12, lg: 4 }}>
                        <Button variant="contained" color="secondary" onClick={() => onDelete(caseData.guidCase)}>
                            Delete
                        </Button>
                    </Grid>
                    <Grid size={{md: 12, lg:4 }}>
                        <Button variant="contained" color="primary" onClick={handleClickOpen}>
                            Upload
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
            <DialogModal
                open={open}
                handleClose={handleClose}
                handleFileChange={handleFileChange}
                uploadStatus={uploadStatus}
                files={selectedFiles}
                guidCase={caseData.guidCase}
                userId={JSON.parse(localStorage.getItem('user')!).id}>
            </DialogModal>
            {/*<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>*/}
            {/*    <DialogTitle>Upload Documents</DialogTitle>*/}
            {/*    <DialogContent>*/}
            {/*        <Typography>Select files to upload:</Typography>*/}
            {/*        <input type="file" multiple onChange={handleFileChange} />*/}
            {/*        {uploadStatus && <Typography>{uploadStatus}</Typography>}*/}
            {/*        <List>*/}
            {/*            {files.map((file: any) => (*/}
            {/*                <ListItem key={file.key}>*/}
            {/*                    <ListItemIcon>*/}
            {/*                        <InsertDriveFileIcon />*/}
            {/*                    </ListItemIcon>*/}
            {/*                    <ListItemText primary={file.name} />*/}
            {/*                </ListItem>*/}
            {/*            ))}*/}
            {/*        </List>*/}
            {/*    </DialogContent>*/}
            {/*    <DialogActions>*/}
            {/*        <Button onClick={handleClose} color="secondary">*/}
            {/*            Cancel*/}
            {/*        </Button>*/}
            {/*        <Button*/}
            {/*            onClick={handleUpload}*/}
            {/*            variant="contained"*/}
            {/*            color="primary"*/}
            {/*            disabled={!selectedFiles}*/}
            {/*        >*/}
            {/*            Upload*/}
            {/*        </Button>*/}
            {/*    </DialogActions>*/}
            {/*</Dialog>*/}
        </Card>
    );
}