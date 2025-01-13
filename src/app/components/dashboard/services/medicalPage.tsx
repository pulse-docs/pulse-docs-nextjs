import React from 'react';
import {Box, Card, CardContent, FormControl, InputLabel, MenuItem, Select} from '@mui/material';
import dayjs from 'dayjs';

interface PageProps {
    id: string;
    index: number;
    medicalServices: { id: string, date: string, type: string }[];
    selectedService: string;
    onServiceChange: (id: string, serviceId: string) => void;
    url: string;
    thumbnail?: boolean;
    zoom: number;
}

const MedicalPage: React.FC<PageProps> = ({ id, index, medicalServices, selectedService, onServiceChange, url, thumbnail, zoom }) => {
    return (
        <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Service</InputLabel>
                        <Select
                            value={selectedService}
                            onChange={(e) => onServiceChange(id, e.target.value)}
                        >
                            {medicalServices.map(service => (
                                <MenuItem key={service.id} value={service.id}>
                                    {dayjs(service.date).format('MM/DD/YYYY')} - {service.type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <img src={url} alt={`Page ${index + 1}`} style={{ width: !zoom ? '100%' : `${zoom}%`, marginBottom: '16px' }} />
            </CardContent>
        </Card>
    );
};

export default MedicalPage;