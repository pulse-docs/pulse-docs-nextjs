// src/components/dashboard/CaseList.tsx
import { Box, Typography, Paper, Select, MenuItem, IconButton } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from "dayjs";

export default function CaseList({ cases, onEdit, onDelete, onFieldChange }: {
    cases: any[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onFieldChange: (id: string, field: string, value: string) => void;
}) {
    const columns: GridColDef[] = [
        { field: '_id', headerName: 'Case ID', width: 150 },
        { field: 'state', headerName: 'State', width: 150 },
        { field: 'createdAt', headerName: 'Created At', width: 200, valueFormatter: (params) => new Date(params).toLocaleString() },
        {
            field: 'dueDate', headerName: 'Due Date', width: 200, renderCell: (params: GridRenderCellParams) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        value={dayjs(params.value)}
                        onChange={(value) => onFieldChange(params.row._id, 'dueDate', value.valueOf())}
                    />
                </LocalizationProvider>
            )
        },
        {
            field: 'priority', headerName: 'Priority', width: 150, renderCell: (params: GridRenderCellParams) => (
                <Select
                    value={params.value}
                    onChange={(e) => onFieldChange(params.row._id, 'priority', e.target.value)}
                >
                    <MenuItem value="standard">STANDARD</MenuItem>
                    <MenuItem value="rush">RUSH</MenuItem>
                    <MenuItem value="express">EXPRESS</MenuItem>
                </Select>
            )
        },
        {
            field: 'assignee', headerName: 'Assignee', width: 150, renderCell: (params: GridRenderCellParams) => (
                <Select
                    value={params.value}
                    onChange={(e) => onFieldChange(params.row._id, 'assignee', e.target.value)}
                >
                    <MenuItem value="User1">User1</MenuItem>
                    <MenuItem value="User2">User2</MenuItem>
                    <MenuItem value="User3">User3</MenuItem>
                </Select>
            )
        },
        {
            field: 'actions', headerName: 'Actions', width: 150, renderCell: (params: GridRenderCellParams) => (
                <>
                    <IconButton edge="end" onClick={() => onEdit(params.row._id)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => onDelete(params.row._id)}>
                        <DeleteIcon />
                    </IconButton>
                </>
            )
        }
    ];

    const rows = cases.map((caseItem) => ({
        id: caseItem._id,
        ...caseItem
    }));

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Active Cases
            </Typography>
            <Paper style={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                />
            </Paper>
        </Box>
    );
}