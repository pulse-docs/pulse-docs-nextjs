'use client';
import { useState } from 'react';
import { copyToClipboard } from "@/app/utils/data.clipboard";
import { Button, TextField, Box, Typography, Paper } from '@mui/material';

export function CardCase({
                             claim_id,
                             extent_of_injury,
                             method_of_injury,
                             date_of_injury,
                             questions,
                             sections,
                             text
                         }: {
    claim_id: string,
    extent_of_injury: string,
    method_of_injury: string,
    date_of_injury: string,
    questions: { number: number, question: string, subquestion: number, answer: string }[],
    sections: {
        history: string,
        records: { date: string, description: string }[],
    },
    text: string
}) {
    const [displayRaw, setDisplayRaw] = useState(true);
    const [searchTerm, setSearchTerm] = useState('extent|intent|eoi|moi|method|mechanism');
    const [selectedParagraphs, setSelectedParagraphs] = useState<number[]>([]);

    const toggleComponent = () => {
        setDisplayRaw(!displayRaw);
    }

    const toggleParagraphSelection = (index: number) => {
        setSelectedParagraphs(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const copySelectedParagraphs = () => {
        selectedParagraphs.sort((a, b) => a - b);
        const textToCopy = selectedParagraphs.map(index =>
            text.split(/\n{2,}/g)[index].replaceAll('\n', ' ')
        ).join('\n\n');
        copyToClipboard(textToCopy).catch(err => console.error(err));
        setSelectedParagraphs([]);
    };

    const regex = new RegExp(`${searchTerm}`, 'gi');
    const highlightText = (text: string) => {
        if (!searchTerm) {
            return text;
        }
        const parts = text.split(' ');
        return parts.map((part, index) => (regex.test(part) ?
            <span key={index} style={{ backgroundColor: 'yellow' }}> {part} </span> : ` ${part} `));
    };

    const formatParagraph = (text: string) => {
        if (text.trim().match(/^(\*\*.*)/g)) {
            return <Typography variant="h6" component="p">{text.replace(/\*/g, '')}</Typography>
        } else {
            return (
                <Box>
                    <Typography variant="body1" component="p" sx={{ pl: 3, py: 1 }}>{highlightText(text)}</Typography>
                    <br />
                </Box>
            )
        }
    }

    const displayText = (text: string) => {
        return text.split(/\n{2,}/g).map((paragraph, index) => (
            <Box
                key={index}
                sx={{
                    pl: 3,
                    pr: 3,
                    py: 1,
                    cursor: 'pointer',
                    backgroundColor: selectedParagraphs.includes(index) ? 'lightblue' : 'inherit'
                }}
                onClick={() => toggleParagraphSelection(index)}
            >
                {formatParagraph(paragraph)}
            </Box>
        ));
    }

    const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <TextField
                    fullWidth
                    value={searchTerm}
                    onChange={handleChangeSearch}
                    placeholder="Search text..."
                    variant="outlined"
                    size="small"
                />
                <Button variant="contained" onClick={copySelectedParagraphs} sx={{ ml: 2 }}>
                    Clipboard
                </Button>
            </Box>
            <Paper sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                {displayText(text)}
            </Paper>
        </Box>
    );
}