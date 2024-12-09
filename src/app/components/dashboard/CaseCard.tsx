import { Card, CardContent, Typography, Box, Button, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function CaseCard({ caseData, onEdit, onDelete, onFieldChange }) {
    const handleDateChange = (date) => {
        onFieldChange(caseData._id, 'dueDate', date);
    };

    const handlePriorityChange = (event) => {
        const newPriority = event.target.value;
        onFieldChange(caseData._id, 'priority', newPriority);
        updateDueDate(newPriority);
    };

    const updateDueDate = (priority) => {
        const createdAtDate = new Date(caseData.createdAt);
        let dueDate;

        switch (priority) {
            case 'Standard':
                dueDate = new Date(createdAtDate.getTime() + 72 * 60 * 60 * 1000); // 72 hours
                break;
            case 'Rush':
                dueDate = new Date(createdAtDate.getTime() + 24 * 60 * 60 * 1000); // 24 hours
                break;
            case 'Ludacris':
                dueDate = createdAtDate; // same date
                break;
            default:
                dueDate = createdAtDate;
        }

        onFieldChange(caseData._id, 'dueDate', dueDate);
    };

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                        value={caseData.priority}
                        onChange={handlePriorityChange}
                        label="Priority"
                    >
                        <MenuItem value="Standard">Standard</MenuItem>
                        <MenuItem value="Rush">Rush</MenuItem>
                        <MenuItem value="Ludacris">Ludacris</MenuItem>
                    </Select>
                </FormControl>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <DatePicker
                        selected={new Date(caseData.createdAt)}
                        disabled
                        customInput={<TextField label="Created At" variant="outlined" fullWidth />}
                    />
                    <DatePicker
                        selected={new Date(caseData.dueDate)}
                        onChange={handleDateChange}
                        customInput={<TextField label="Due Date" variant="outlined" fullWidth />}
                    />
                </Box>

                <Typography variant="body2" sx={{ mt: 2 }}>Assignee: {caseData.assignee}</Typography>
                <Typography variant="body2">Records: {caseData.recordsReviewed?.length}</Typography>
                <Typography variant="body2">Questions: {caseData.questions?.length}</Typography>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={() => onEdit(caseData._id)}>
                        Edit
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => onDelete(caseData._id)} sx={{ ml: 2 }}>
                        Delete
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}