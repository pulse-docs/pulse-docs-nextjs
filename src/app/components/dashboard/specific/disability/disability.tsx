'use client';
import React, { useState } from 'react';
import { TextField, Box, Typography } from '@mui/material';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from 'date-fns';

export default function Disability() {
    const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
    const [numDays, setNumDays] = useState<number>(0);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);

    const handleNumDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const days = parseInt(e.target.value, 10) || 0;
        setNumDays(days);
        if (selectedDay) {
            setEndDate(addDays(selectedDay, days));
        }
    };

    const handleDateChange = (date: Date | null) => {
        if (!date) { return }
        setSelectedDay(date);
        if (date && numDays) {
            setEndDate(addDays(date, numDays));
        }
    }

    return (
        <Box width="100%">
            <Box display="flex" flexDirection="column" gap={2} mt={5}>
                <DatePicker
                    selected={selectedDay}
                    onChange={handleDateChange}
                    customInput={<TextField label="Date of Injury" variant="outlined" fullWidth />}
                />
                <TextField
                    type="number"
                    value={numDays}
                    onChange={handleNumDaysChange}
                    label="Number of Days"
                    variant="outlined"
                    fullWidth
                />
            </Box>
            <Box display="flex" flexDirection="column" gap={2} mt={5}>
                <Typography variant="body1">Date of Injury: {selectedDay?.toLocaleDateString()}</Typography>
                <Typography variant="body1">Number of Days: {numDays}</Typography>
                <Typography variant="body1">End Date: <b>{endDate?.toLocaleDateString()}</b></Typography>
            </Box>
        </Box>
    );
}