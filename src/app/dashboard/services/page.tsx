"use client";

import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { Box, Button, Grid2 as Grid, TextField, Typography } from '@mui/material';
import Droppable from '@/app/components/dashboard/services/droppable';
import Draggable from '@/app/components/dashboard/services/draggable';
import { createService, updateService, deleteService } from '@/app/lib/servicesCallbacks';
import { v4 as uuidv4 } from 'uuid';

export default function DnDPage() {
    const [availableItems, setAvailableItems] = useState<string[]>([]);
    const [droppedItems, setDroppedItems] = useState<{ [key: string]: string[] }>({});
    const [droppableAreas, setDroppableAreas] = useState<string[]>([]);
    const [caseGuid, setCaseGuid] = useState('');
    const [droppableInfo, setDroppableInfo] = useState<{ [key: string]: { date: number | null, type: string, summary: string } }>({});
    const [showCreateService, setShowCreateService] = useState(false);

    useEffect(() => {
        if (caseGuid) {
            fetchMedicalServices(caseGuid);
        }
    }, [caseGuid]);

    function logDrop(itemId: string, droppableId: string) {
        console.log(`Item ${itemId} dropped into ${droppableId}`);
    }

    function logRemove(itemId: string, droppableId: string) {
        console.log(`Item ${itemId} removed from ${droppableId}`);
    }

    async function handleDragEnd(event: any) {
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
                    newDroppedItems[over.id] = [...(newDroppedItems[over.id] || []), active.id];
                    logDrop(active.id, over.id);
                    return newDroppedItems;
                });
                setAvailableItems((prev) => prev.filter((item) => item !== active.id));
                // await addRecordToCase(guid, over.id, active.id);
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
            // await removeRecordFromCase(guid, active.id);
        }
    }

    async function handleAddDroppable() {
        const serviceGuid = uuidv4().toString();
        setDroppableAreas([...droppableAreas, serviceGuid]);
        setDroppedItems((prev) => ({ ...prev, [serviceGuid]: [] }));
        setDroppableInfo((prev) => ({ ...prev, [serviceGuid]: { date: null, type: '', summary: '' } }));
        await createService({ guid: serviceGuid, caseGuid: caseGuid, date: null, type: '', summary: '' });
    }

    async function handleDeleteDroppable(id: string) {
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
        await deleteService(id);
    }

    async function handleInfoChange(id: string, field: string, value: any) {
        setDroppableInfo((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value,
            },
        }));
        console.log('handle info change ', id, field, value);
        await updateService({ guid: id, [field]: value });
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
            const urls = await fetchThumbnailURLs(caseGuid);
            setAvailableItems(urls);
        } catch (error) {
            console.error('Error fetching thumbnails:', error);
        }
    }

    async function fetchMedicalServices(caseGuid: string) {
        try {
            const response = await fetch(`/api/services?caseGuid=${caseGuid}`);
            if (!response.ok) {
                throw new Error('Failed to fetch medical services');
            }
            const data = await response.json();
            console.log(data)
            const services = data.body;
            const newDroppableAreas = services?.map((service: any) => service.guid);
            const newDroppedItems: { [key: string]: string[] } = {};
            const newDroppableInfo: { [key: string]: { date: number | null, type: string, summary: string } } = {};

            services.forEach((service: any) => {
                newDroppedItems[service.guid] = service.items || [];
                newDroppableInfo[service.guid] = {
                    date: service.date,
                    type: service.type,
                    summary: service.summary,
                };
            });

            setDroppableAreas(newDroppableAreas);
            setDroppedItems(newDroppedItems);
            setDroppableInfo(newDroppableInfo);
        } catch (error) {
            console.error('Error fetching medical services:', error);
        }
    }

    return (
        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                    <TextField
                        label="GUID"
                        value={caseGuid}
                        onChange={(e) => setCaseGuid(e.target.value)}
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
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={id}>
                                <SortableContext items={droppedItems[id]}>
                                    <Droppable id={id} info={droppableInfo[id]} handleInfoChange={handleInfoChange} onDelete={() => handleDeleteDroppable(id)}>
                                        {droppedItems[id]?.map((itemId, index) => (
                                            <Draggable key={itemId} id={itemId} index={index}>
                                                <img src={itemId} alt={itemId} style={{ width: '50px', height: '50px' }} />
                                            </Draggable>
                                        ))}
                                    </Droppable>
                                </SortableContext>
                            </Grid>
                        ))}
                        <Grid size={{ xs: 12 }}>
                            <Button variant="contained" onClick={handleAddDroppable}>
                                Create Medical Service
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                <Box>
                    <Typography variant="h6">Draggable Items - {availableItems?.length}</Typography>
                    <Grid container spacing={2}>
                        {availableItems.map((item, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item}>
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