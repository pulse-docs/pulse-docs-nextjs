"use client";

import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { Box, Card, CardContent, Typography, Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';

function Droppable(props: { id: string, children: React.ReactNode, info: any, handleInfoChange: (id: string, field: string, value: any) => void, onDelete: () => void }) {
    const { isOver, setNodeRef } = useDroppable({
        id: props.id,
    });
    const style = {
        border: '2px dashed gray',
        padding: '16px',
        backgroundColor: isOver ? 'lightgreen' : 'white',
        minHeight: '100px',
        position: 'relative',
    };

    return (
        <Box ref={setNodeRef} sx={style}>
            <IconButton
                onClick={props.onDelete}
                sx={{ position: 'absolute', top: 8, right: 8 }}
            >
                <DeleteIcon />
            </IconButton>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Date"
                    value={dayjs(props.info.date)}
                    onChange={(newValue) => props.handleInfoChange(props.id, 'date', newValue?.valueOf())}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                />
            </LocalizationProvider>
            <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Type</InputLabel>
                <Select
                    value={props.info.type}
                    onChange={(e) => props.handleInfoChange(props.id, 'type', e.target.value)}
                >
                    <MenuItem value="Type1">Type1</MenuItem>
                    <MenuItem value="Type2">Type2</MenuItem>
                    <MenuItem value="Type3">Type3</MenuItem>
                </Select>
            </FormControl>
            <TextField
                fullWidth
                label="Summary"
                value={props.info.summary}
                onChange={(e) => props.handleInfoChange(props.id, 'summary', e.target.value)}
                multiline
                rows={2}
                sx={{ mt: 2 }}
            />
            {props.children}
        </Box>
    );
}

function Draggable(props: { id: string, children: React.ReactNode, index: number }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: props.id,
    });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <Card ref={setNodeRef} sx={style} {...listeners} {...attributes}>
            <CardContent>
                <Typography variant="body2">Page {props.index + 1}</Typography>
                {props.children}
            </CardContent>
        </Card>
    );
}

export default function DnDPage() {
    const [availableItems, setAvailableItems] = useState<string[]>([]);
    const [droppedItems, setDroppedItems] = useState<{ [key: string]: string[] }>({
        droppable1: [],
    });
    const [droppableAreas, setDroppableAreas] = useState(['droppable1']);
    const [guid, setGuid] = useState('');
    const [droppableInfo, setDroppableInfo] = useState<{ [key: string]: { date: number | null, type: string, summary: string } }>({
        droppable1: { date: null, type: '', summary: '' },
    });

    function logDrop(itemId: string, droppableId: string) {
        console.log(`Item ${itemId} dropped into ${droppableId}`);
    }

    function logRemove(itemId: string, droppableId: string) {
        console.log(`Item ${itemId} removed from ${droppableId}`);
    }

    function handleDragEnd(event: any) {
        const { active, over } = event;
        if (over) {
            if (active.id !== over.id) {
                setDroppedItems((prev) => {
                    const newDroppedItems = { ...prev };
                    for (const key in newDroppedItems) {
                        if (newDroppedItems[key].includes(active.id)) {
                            logRemove(active.id, key);
                        }
                        newDroppedItems[key] = newDroppedItems[key].filter((item) => item !== active.id);
                    }
                    newDroppedItems[over.id] = [...newDroppedItems[over.id], active.id];
                    logDrop(active.id, over.id);
                    return newDroppedItems;
                });
                setAvailableItems((prev) => prev.filter((item) => item !== active.id));
            }
        } else {
            setAvailableItems((prev) => {
                setDroppedItems((prevDropped) => {
                    const newDroppedItems = { ...prevDropped };
                    for (const key in newDroppedItems) {
                        if (newDroppedItems[key].includes(active.id)) {
                            logRemove(active.id, key);
                        }
                        newDroppedItems[key] = newDroppedItems[key].filter((item) => item !== active.id);
                    }
                    return newDroppedItems;
                });
                if (!prev.includes(active.id)) {
                    return [...prev, active.id];
                }
                return prev;
            });
        }
    }

    function handleAddDroppable() {
        const newId = `droppable${droppableAreas.length + 1}`;
        setDroppableAreas([...droppableAreas, newId]);
        setDroppedItems((prev) => ({ ...prev, [newId]: [] }));
        setDroppableInfo((prev) => ({ ...prev, [newId]: { date: null, type: '', summary: '' } }));
    }

    function handleDeleteDroppable(id: string) {
        setDroppedItems((prev) => {
            const newDroppedItems = { ...prev };
            const itemsToReAdd = newDroppedItems[id];
            delete newDroppedItems[id];
            setAvailableItems((prevAvailable) => [...prevAvailable, ...itemsToReAdd]);
            return newDroppedItems;
        });
        setDroppableAreas((prev) => prev.filter((area) => area !== id));
        setDroppableInfo((prev) => {
            const newDroppableInfo = { ...prev };
            delete newDroppableInfo[id];
            return newDroppableInfo;
        });
    }

    function handleInfoChange(id: string, field: string, value: any) {
        setDroppableInfo((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value,
            },
        }));
    }

    async function fetchThumbnailURLs(guid: string) {
        const response = await fetch(`/api/pages?guid=${guid}`);
        if (!response.ok) {
            throw new Error('Failed to fetch thumbnail URLs');
        }
        const data = await response.json();
        return data.imageUrls;
    }

    async function handleFetchThumbnails() {
        try {
            const urls = await fetchThumbnailURLs(guid);
            setAvailableItems(urls);
        } catch (error) {
            console.error('Error fetching thumbnails:', error);
        }
    }

    return (
        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                    <TextField
                        label="GUID"
                        value={guid}
                        onChange={(e) => setGuid(e.target.value)}
                        fullWidth
                    />
                    <Button variant="contained" onClick={handleFetchThumbnails} sx={{ mt: 2 }}>
                        Fetch Thumbnails
                    </Button>
                </Box>
                <Box>
                    <Typography variant="h6">Medical Services</Typography>
                    <Grid container spacing={2}>
                        {droppableAreas.map((id) => (
                            <Grid item xs={12} sm={6} md={4} key={id}>
                                <SortableContext items={droppedItems[id]}>
                                    <Droppable id={id} info={droppableInfo[id]} handleInfoChange={handleInfoChange} onDelete={() => handleDeleteDroppable(id)}>
                                        {droppedItems[id].map((itemId, index) => (
                                            <Draggable key={itemId} id={itemId} index={index}>
                                                <img src={itemId} alt={itemId} style={{ width: '50px', height: '50px' }} />
                                            </Draggable>
                                        ))}
                                    </Droppable>
                                </SortableContext>
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Button variant="contained" onClick={handleAddDroppable}>Add Medical Service</Button>
                        </Grid>
                    </Grid>
                </Box>
                <Box>
                    <Typography variant="h6">Draggable Items</Typography>
                    <Grid container spacing={2}>
                        {availableItems.map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} key={item}>
                                <Draggable id={item} index={index}>
                                    <img src={item} alt={item} style={{ width: '100%' }} />
                                </Draggable>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </DndContext>
    );
}