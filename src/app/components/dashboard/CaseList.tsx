// src/components/dashboard/CaseList.tsx
import { Box, List, ListItem, ListItemText, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CaseList({ cases, onEdit, onDelete }: {
    cases: any[];
    onEdit: (caseItem: any) => void;
    onDelete: (id: string) => void;
}) {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
    Active Cases
    </Typography>
    <List>
    {cases.map((caseItem) => (
            <ListItem key={caseItem._id} secondaryAction={
        <>
        <IconButton edge="end" onClick={() => onEdit(caseItem)}>
    <EditIcon />
    </IconButton>
    <IconButton edge="end" onClick={() => onDelete(caseItem._id)}>
    <DeleteIcon />
    </IconButton>
    </>
}>
    <ListItemText
        primary={caseItem.title}
    secondary={`State: ${caseItem.state}`}
    />
    </ListItem>
))}
    </List>
    </Box>
);
}