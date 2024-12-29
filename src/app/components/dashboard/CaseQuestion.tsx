import React from 'react';
import { Box, Typography, IconButton, Card, CardContent, CardActions, Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface CaseQuestionProps {
    caseGuid: string;
    questionGuid: string;
    questionText: string;
    responseText: string;
    onDelete: (questionGuid: string) => void;
    onInfoChange: (questionGuid: string, field: string, value: string) => void;
}

const CaseQuestion: React.FC<CaseQuestionProps> = ({ caseGuid, questionGuid, questionText, responseText, onDelete, onInfoChange }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6">Question {questionGuid}</Typography>
                <TextField
                    label="Question"
                    value={questionText}
                    onChange={(e) => onInfoChange(questionGuid, 'questionText', e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Response"
                    value={responseText}
                    onChange={(e) => onInfoChange(questionGuid, 'responseText', e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                />
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => onDelete(questionGuid)}>Delete</Button>
            </CardActions>
        </Card>
    );
};

export default CaseQuestion;