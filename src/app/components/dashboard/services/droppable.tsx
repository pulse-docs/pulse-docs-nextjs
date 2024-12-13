import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';

interface DroppableProps {
    id: string;
    children: React.ReactNode;
    info: any;
    handleInfoChange: (id: string, field: string, value: any) => void;
    onDelete: () => void;
}

const Droppable: React.FC<DroppableProps> = ({ id, children, info, handleInfoChange, onDelete }) => {
    const { isOver, setNodeRef } = useDroppable({ id });
    const style = {
        border: '2px dashed gray',
        padding: '16px',
        backgroundColor: isOver ? 'lightgreen' : 'white',
        minHeight: '100px',
        position: 'relative',
    };

    return (
        <Box ref={setNodeRef} sx={style}>
            <IconButton onClick={onDelete} sx={{ position: 'absolute', top: 8, right: 8 }}>
                <DeleteIcon />
            </IconButton>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Date"
                    value={dayjs(info.date)}
                    onChange={(newValue) => handleInfoChange(id, 'date', newValue?.valueOf())}
                />
            </LocalizationProvider>
            <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Type</InputLabel>
                <Select value={info.type} onChange={(e) => handleInfoChange(id, 'type', e.target.value)}>
                    <MenuItem value="Type1">Type1</MenuItem>
                    <MenuItem value="Type2">Type2</MenuItem>
                    <MenuItem value="Type3">Type3</MenuItem>
                </Select>
            </FormControl>
            <TextField
                fullWidth
                label="Summary"
                value={info.summary}
                onChange={(e) => handleInfoChange(id, 'summary', e.target.value)}
                multiline
                rows={2}
                sx={{ mt: 2 }}
            />
            {children}
        </Box>
    );
};

export default Droppable;