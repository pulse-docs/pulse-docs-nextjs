// src/components/dashboard/CaseList.tsx
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Typography, Paper, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { LocalizationProvider} from "@mui/x-date-pickers";
import { AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from "dayjs";


export default function CaseList({ cases, onEdit, onDelete, onFieldChange }: {
    cases: any[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onFieldChange: (id: string, field: string, value: string) => void;
}) {
    const handleFieldChange = (id: string, field: string) => (event: React.ChangeEvent<{ value: unknown }>) => {
        onFieldChange(id, field, event.target.value as string);
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Active Cases
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/*<TableCell>Case ID</TableCell>*/}
                            <TableCell>State</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Assignee</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cases.map((caseItem) => (
                            <TableRow key={caseItem._id}>
                                {/*<TableCell>{caseItem._id}</TableCell>*/}
                                <TableCell>{caseItem.state}</TableCell>
                                <TableCell>{new Date(caseItem.createdAt).toLocaleString()}</TableCell>
                                <TableCell>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            value={dayjs(caseItem.dueDate)}
                                            onChange={(value) => onFieldChange(caseItem._id, 'dueDate', value.valueOf())}
                                        />
                                    </LocalizationProvider>
                                    {/*<Select*/}
                                    {/*    value={caseItem.dueDate}*/}
                                    {/*    onChange={handleFieldChange(caseItem._id, 'dueDate')}*/}
                                    {/*>*/}
                                    {/*    <MenuItem value="2023-10-01">2023-10-01</MenuItem>*/}
                                    {/*    <MenuItem value="2023-11-01">2023-11-01</MenuItem>*/}
                                    {/*    <MenuItem value="2023-12-01">2023-12-01</MenuItem>*/}
                                    {/*</Select>*/}
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={caseItem.priority}
                                        onChange={(e) => onFieldChange(caseItem._id, 'priority', e.target.value)}
                                    >
                                        <MenuItem value="standard">STANDARD</MenuItem>
                                        <MenuItem value="sush">RUSH</MenuItem>
                                        <MenuItem value="express">EXPRESS</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={caseItem.assignee}
                                        onChange={(e) => onFieldChange(caseItem._id, 'assignee', e.target.value)}
                                    >
                                        <MenuItem value="User1">User1</MenuItem>
                                        <MenuItem value="User2">User2</MenuItem>
                                        <MenuItem value="User3">User3</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <IconButton edge="end" onClick={() => onEdit(caseItem._id)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton edge="end" onClick={() => onDelete(caseItem._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}