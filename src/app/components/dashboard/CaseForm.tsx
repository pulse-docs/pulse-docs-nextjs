"use client";
import {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    SelectChangeEvent,
    TextField,
    Typography
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import dayjs, {Dayjs} from 'dayjs';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {useRouter} from 'next/navigation';

import {CaseData, createCaseData, Question, Record} from "@/app/types/case";
import {MetadataSection} from "@/app/components/dashboard/specific/cases/metadata";

import {DialogModal} from "@/app/components/dashboard/UploadModal";


async function fetchCaseData(id: string) {
    const response = await fetch(`/api/cases?id=${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch case data');
    }
    return (await response.json()).body;
}

export default function CaseForm({ onSubmit, id }: { onSubmit?: Function, id?: string }) {
    const [caseData, setCaseData] = useState<CaseData>(createCaseData());
    const [open, setOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [files, setFiles] = useState<{ key: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [thumbnailURLs, setThumbnailURLs] = useState<string[]>([]);

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
        fetchFiles()
            .catch((err) => setError(err.message));
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

    const handleCreateOrUpdate = async (caseData: CaseData) => {
        const response = await fetch('/api/cases', {
            method: caseData.guid ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(caseData),
        });
    };

    const handleChange = (e: { name?: string; value: string }) => {
        setCaseData({
            ...caseData,
            [e.name as string]: e.value
        });
    };
    const handleSelectChange = (e: SelectChangeEvent<{name?:string; value: unknown}>) => {
        setCaseData({
            ...caseData,
            [e.target.name as string]: e.target.value
        });
    };


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

    const handleDateChange = (id: number, newDate: Dayjs | null) => {
        const updatedRecords = caseData.recordsReviewed.map(
            record => record.id === id ? { ...record, date: newDate! } : record
        );
        setCaseData({ ...caseData, recordsReviewed: updatedRecords });
    };

    const handleTypeChange = (id: number, newType: string) => {
        const updatedRecords = caseData.recordsReviewed.map(
            record => record.id === id ? { ...record, type: newType } : record
        );
        setCaseData({ ...caseData, recordsReviewed: updatedRecords });
    };

    const handleEdit = (id: number, updatedRecord: Record) => {
        const updatedRecords = caseData.recordsReviewed.map(
            record => record.id === id ? updatedRecord : record
        );
        setCaseData({ ...caseData, recordsReviewed: updatedRecords });
    };

    const handleEditQuestion = (id: number, updatedQuestion: Question) => {
        const updatedQuestions = caseData.questions.map(
            question => question.id === id ? updatedQuestion : question
        );
        setCaseData({ ...caseData, questions: updatedQuestions });
    }

    const handleEditResponse = (id: number, updatedQuestion: Question) => {
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

    async function handleSubmit(e: React.FormEvent) {
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFiles(e.target.files);
    };

    async function handleUpload(){
        const formData = new FormData();
        formData.append('guidCase', caseData.guid);
        Array.from(selectedFiles!).forEach((file) => {
            formData.append('files', file);
            const chunkSize = 5 * 1024 * 1024; // 5MB
            const numChunks = Math.ceil(file.size / chunkSize);
            const uploadedParts: { ETag: string; PartNumber: number; }[] = [];

            // Step 1: Initialize multipart upload
            return fetch("/api/upload-multipart", {
                method: "POST",
                body: JSON.stringify({ fileName: file.name, fileType: file.type }),
                headers: { "Content-Type": "application/json" },
            })
                .then((response) => response.json())
                .then(({ uploadId }) => {
                    let chain = Promise.resolve();

                    // Step 2: Process chunks in a chain
                    for (let i = 0; i < numChunks; i++) {
                        chain = chain.then(() => {
                            const start = i * chunkSize;
                            const end = Math.min(start + chunkSize, file.size);
                            const fileChunk = file.slice(start, end);

                            // Request pre-signed URL for the chunk
                            return fetch("/api/upload-part", {
                                method: "POST",
                                body: JSON.stringify({
                                    fileName: file.name,
                                    uploadId,
                                    partNumber: i + 1,
                                }),
                                headers: { "Content-Type": "application/json" },
                            })
                                .then((response) => response.json())
                                .then(({ url }) =>
                                    // Upload the chunk directly to S3
                                    fetch(url, {
                                        method: "PUT",
                                        body: fileChunk,
                                        headers: { "Content-Type": file.type },
                                    })
                                )
                                .then((uploadResponse) => {
                                    if (!uploadResponse.ok) {
                                        throw new Error(`Failed to upload chunk ${i + 1}`);
                                    }

                                    // Collect ETag for completion
                                    const etag = uploadResponse.headers.get("ETag");
                                    if (etag) {
                                        uploadedParts.push({ ETag: etag, PartNumber: i + 1 });
                                    }

                                });
                        });
                    }

                    // Step 3: Complete the upload after all chunks are processed
                    return chain.then(() =>
                        fetch("/api/complete-upload", {
                            method: "POST",
                            body: JSON.stringify({
                                fileName: file.name,
                                uploadId,
                                parts: uploadedParts,
                            }),
                            headers: { "Content-Type": "application/json" },
                        })
                    );
                });
        });

        // try {
        //     const response = await fetch('/api/upload', {
        //         method: 'POST',
        //         body: formData,
        //     });
        //
        //     const result = await response.json();
        //     setUploadStatus(null);
        //     handleClose();
        //     fetchFiles();
        // } catch (error) {
        //     setUploadStatus(null);
        // }

    };

    const handleDeleteFile = async (key: string) => {
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
            <MetadataSection caseData={caseData} handleChange={handleChange} handleSelectChange={handleSelectChange} handleClickOpen={handleClickOpen} handleDeleteFile={handleDeleteFile}/>
            <DialogModal open={open} handleClose={handleClose} handleFileChange={handleFileChange} uploadStatus={uploadStatus} handleUpload={handleUpload} selectedFiles={selectedFiles} />
            {files?.length ? <FileList files={files} onDeleteFile={handleDeleteFile} /> : null}
            {thumbnailURLs?.length ? <ImageGrid thumbnailURLs={thumbnailURLs} /> : null}
            <CardGrid title="Records Reviewed" items={caseData.recordsReviewed} onAddItem={addRecord} renderItem={(record: Record) => (
                <RecordCard record={record} onDateChange={handleDateChange} onTypeChange={handleTypeChange} onEdit={handleEdit} onDelete={handleDelete} />
            )} />
            <CardGrid title="Questions" items={caseData.questions} onAddItem={addQuestion} renderItem={(question: Question) => (
                <QuestionCard question={question} onEdit={handleEditQuestion} onDelete={handleDeleteQuestion} />
            )} />
            <Button type="submit" variant="contained">{id ? 'Update Case' : 'Submit Case'}</Button>
        </Box>
    );
}




function FileList({ files, onDeleteFile }: { files: { key: string; name: string }[], onDeleteFile: (key: string) => void }) {
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

function ImageGrid({ thumbnailURLs }: { thumbnailURLs: string[] }) {
    return (
        <Grid container spacing={2}>
            {thumbnailURLs.map((url, index) => (
                <Grid size={{xs: 12, sm:6, md:4}} key={index}>
                    <img src={url} style={{ width: '100%' }} alt="" />
                </Grid>
            ))}
        </Grid>
    );
}

function CardGrid({ title, items, renderItem, onAddItem }: { title: string, items: any[], renderItem: (item: any) => JSX.Element, onAddItem: () => void }) {
    return (
        <Box mb={2}>
            <Typography variant="h6">{title}</Typography>
            <Grid container spacing={2}>
                {items?.map((item, idx) => (
                    <Grid size={{xs: 12, sm:6, md:4}} key={idx}>
                        {renderItem(item)}
                    </Grid>
                ))}
                <Grid size={{xs:12}}>
                    <Button onClick={onAddItem} startIcon={<AddIcon />}>Add New</Button>
                </Grid>
            </Grid>
        </Box>
    );
}

function RecordCard({ record, onDateChange, onTypeChange, onEdit, onDelete }: { record: Record, onDateChange: (id: number, newDate: Dayjs | null) => void, onTypeChange: (id: number, newType: string) => void, onEdit: (id: number, updatedRecord: Record) => void, onDelete: (id: number) => void }) {
    return (
        <Card>
            <CardContent>
                <Grid container spacing={2} mb={2}>
                    <Grid size={{xs:6}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Date"
                                value={dayjs(record.date)}
                                onChange={(newValue) => onDateChange(record.id, newValue)}
                                // renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid size={{xs:6}}>
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

function QuestionCard({ question, onEdit, onDelete }: { question: Question, onEdit: (id: number, updatedQuestion: Question) => void, onDelete: (id: number) => void }) {
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