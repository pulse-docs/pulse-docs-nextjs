'use client';
import { useEffect, useState } from 'react';
import { Box, Button, Typography, TextField, Paper, CircularProgress } from '@mui/material';
import TextArea from "@/app/components/dashboard/specific/peergpt/textarea";
import Query from "@/app/components/dashboard/specific/peermri/query";
import { copyToClipboard } from "@/app/utils/data.clipboard";

export default function PeerGPT() {
    const [history, setHistory] = useState('');
    const [query, setQuery] = useState('');
    const [resp, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            getResponse(setResponse);
        }
    }

    const promptClear = () => {
        setQuery("");
    }

    const promptEOI = () => {
        setQuery("Explain in detail what a \"Extent of injury\" is, and how these injuries commonly occur from \"Mechanism of injury.\" After this explanation, using only the mechanism of injury, subjective complaints, physical exam findings, and diagnostics in the records reviewed, explain why a \"Extent of injury\" occurred from the mechanism of injury at work.");
    }

    const promptMRI = () => {
        setQuery("Keeping in mind the only work related conditions are **INJURY**, list each of the MRI findings. For each finding, explain in detail why they are work related, or not work related conditions. Do this by referencing the mechanism of injury, subjective complaints, and physical exam findings documented in the records reviewed.");
    }

    const getResponse = (setter: Function) => {
        setLoading(true);
        fetch('/api/peergpt/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                history: history,
                question: query
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                setter(data);
            }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">History and Records</Typography>
            </Box>
            <TextArea value={history} cb={setHistory} />

            <Box sx={{ display: 'flex', gap: 2, mt: 3, mb: 3 }}>
                <Button variant="contained"  onClick={promptEOI}>EOI/MOI Prompt</Button>
                <Button variant="contained"  onClick={promptMRI}>MRI Prompt</Button>
                <Button variant="contained" color="secondary" onClick={promptClear}>Clear</Button>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">Question</Typography>
            </Box>
            <Query placeholder="Query" query={query} cb={setQuery} handleSubmit={handleKeyPress} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">Response</Typography>
            </Box>
            <Paper sx={{ p: 2, mb: 3, cursor: 'pointer' }} onClick={() => copyToClipboard(resp)}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    resp ? resp.split(/\n{2,}/g).map((p, i) => (
                        <Box key={i} sx={{ px: 3, py: 2 }}>
                            <Typography>{p}</Typography>
                        </Box>
                    )) : <Typography></Typography>
                )}
            </Paper>
        </Box>
    );
}