import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, IconButton, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MedicalPage from './medicalPage';
import dayjs from 'dayjs';

interface MedicalServiceProps {
    id: string;
    info: any;
    items: { id: string, bucket: string, key: string, url: string }[];
    medicalServices: { id: string, date: string, type: string }[];
    onServiceChange: (id: string, serviceId: string) => void;
    handleInfoChange: (id: string, field: string, value: any) => void;
    onDelete: () => void;
    onOpenDrawer: (items: { id: string, bucket: string, key: string, url: string }[]) => void;
}

const MedicalService: React.FC<MedicalServiceProps> = ({ id, info, items, medicalServices, onServiceChange, handleInfoChange, onDelete, onOpenDrawer }) => {
    const [open, setOpen] = useState(false);
    const [types, setTypes] = useState<string[]>([]);
    const [newType, setNewType] = useState('');
    const [isAddingNewType, setIsAddingNewType] = useState(false);

    useEffect(() => {
        fetchTypes();
    }, []);

    async function fetchTypes() {
        try {
            const response = await fetch('/api/serviceTypes');
            const data = await response.json();
            setTypes(data.body.map((type: any) => type.serviceType));
        } catch (error) {
            console.error('Failed to fetch types', error);
        }
    }

    const handleClickOpen = () => {
        onOpenDrawer(items);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddType = async () => {
        try {
            const response = await fetch('/api/serviceTypes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: newType }),
            });
            const data = await response.json();
            setTypes([...types, data.type]);
            setNewType('');
            setIsAddingNewType(false);
            fetchTypes();
        } catch (error) {
            console.error('Failed to add type', error);
        }
    };

    return (
        <Box sx={{ padding: '16px', backgroundColor: 'background.paper', minHeight: '100px', position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
            <IconButton onClick={handleClickOpen} sx={{ position: 'absolute', top: 8, right: 40 }}>
                <VisibilityIcon />
            </IconButton>
            <IconButton onClick={onDelete} sx={{ position: 'absolute', top: 8, right: 8 }}>
                <DeleteIcon />
            </IconButton>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Date"
                    value={dayjs(info.date)}
                    onChange={(newValue) => handleInfoChange(id, 'date', newValue?.valueOf())}
                    renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
                />
            </LocalizationProvider>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Type</InputLabel>
                <Select
                    value={info.type}
                    onChange={(e) => {
                        if (e.target.value === 'add_new') {
                            setIsAddingNewType(true);
                        } else {
                            handleInfoChange(id, 'type', e.target.value);
                        }
                    }}
                >
                    {types.map((type, index) => (
                        <MenuItem key={index} value={type}>{type}</MenuItem>
                    ))}
                    <MenuItem value="add_new">Add New Type</MenuItem>
                </Select>
            </FormControl>
            {isAddingNewType && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TextField
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        placeholder="Enter new type"
                        fullWidth
                    />
                    <Button onClick={handleAddType} sx={{ ml: 2 }}>Add</Button>
                </Box>
            )}
            <TextField
                fullWidth
                label="Summary"
                value={info.summary}
                onChange={(e) => handleInfoChange(id, 'summary', e.target.value)}
                multiline
                rows={2}
                sx={{ mb: 2 }}
            />
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Medical Pages ({items.length})</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        {items.map((item, index) => (
                            <Grid item xs={12} md={6} key={item.key}>
                                <MedicalPage
                                    id={item.key}
                                    index={index}
                                    medicalServices={medicalServices}
                                    selectedService={id}
                                    onServiceChange={onServiceChange}
                                    url={item.url}
                                    thumbnail={true}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default MedicalService;