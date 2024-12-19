import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, useTheme } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import Draggable from './draggable';

interface DroppableProps {
    id: string;
    children: React.ReactNode;
    info: any;
    handleInfoChange: (id: string, field: string, value: any) => void;
    onDelete: () => void;
    onRemoveItem: (itemId: string) => void;
}

const Droppable: React.FC<DroppableProps> = ({ id, children, info, handleInfoChange, onDelete, onRemoveItem }) => {
    const { isOver, setNodeRef } = useDroppable({ id });
    const theme = useTheme();

    return (
        <Box
            ref={setNodeRef}
            sx={{
                padding: '16px',
                backgroundColor: isOver ? theme.palette.action.hover : theme.palette.background.paper,
                minHeight: '100px',
                position: 'relative',
            }}
        >
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
            {React.Children.map(children, (child) =>
                React.cloneElement(child as React.ReactElement, {
                    showTrashIcon: true,
                    onRemove: () => onRemoveItem((child as React.ReactElement).props.id),
                })
            )}
        </Box>
    );
};

export default Droppable;