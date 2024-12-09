'use client';
import { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import TextArea from "@/app/components/dashboard/specific/peermri/textarea";
import Query from "@/app/components/dashboard/specific/peermri/query";
import { copyToClipboard } from "@/app/utils/data.clipboard";

export default function PeerMRI() {
    const [history, setHistory] = useState('');
    const [query, setQuery] = useState('');
    const [resp, setResponse] = useState(' ');
    const [loading, setLoading] = useState(false);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            getResponse(setResponse);
        }
    }

    const getResponse = (setter: Function) => {
        setLoading(true);

        fetch('/api/langgraph/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                topK: 12,
                history: history,
                question: query
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                setter(data);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    console.log("Response: ", resp);

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={5} mb={3}>
                <Typography variant="h5">History and Records</Typography>
            </Box>
            <TextArea value={history} cb={setHistory} />

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={10} mb={3}>
                <Typography variant="h5">Question</Typography>
            </Box>
            <Query placeholder="Query" query={query} cb={setQuery} handleSubmit={handleKeyPress} />

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={10} mb={3}>
                <Typography variant="h5">Response</Typography>
            </Box>
            <Paper
                onClick={() => copyToClipboard(resp)}
                sx={{
                    cursor: 'pointer',
                    backgroundColor: 'white',
                    boxShadow: 1,
                    borderRadius: 1,
                    overflow: 'hidden',
                    border: 1,
                    borderColor: 'grey.200',
                    my: 4,
                    p: 2,
                }}
            >
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" p={6}>
                        <CircularProgress />
                    </Box>
                ) : (
                    resp ? resp.split(/\n{2,}/g).map((p, i) => (
                        <Box key={i} px={2} py={1}>
                            <Typography>{p}</Typography>
                        </Box>
                    )) : <Typography></Typography>
                )}
            </Paper>
        </Box>
    )
}