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
    const [availableItems, setAvailableItems] = useState<{ bucket: string, key: string, url: string }[]>([]);
    const [droppedItems, setDroppedItems] = useState<{ [key: string]: { bucket: string, key: string }[] }>({});
    const [droppableAreas, setDroppableAreas] = useState<string[]>([]);
    const [caseGuid, setCaseGuid] = useState('');
    const [droppableInfo, setDroppableInfo] = useState<{ [key: string]: { date: number | null, type: string, summary: string } }>({});
    const [showCreateService, setShowCreateService] = useState(false);

    useEffect(() => {
        if (caseGuid) {
            fetchMedicalServicesAndThumbnails(caseGuid).then().catch(err => console.error(err));
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
                        if (newDroppedItems[key].some(item => item.key === active.id)) {
                            logRemove(active.id, key);
                        }
                        newDroppedItems[key] = newDroppedItems[key].filter((item) => item.key !== active.id);
                    }
                    const droppedItem = availableItems.find(item => item.key === active.id);
                    if (droppedItem) {
                        newDroppedItems[over.id] = [...(newDroppedItems[over.id] || []), { bucket: droppedItem.bucket, key: droppedItem.key }];
                        logDrop(active.id, over.id);
                        updateService({ guid: over.id, items: newDroppedItems[over.id] });
                    }
                    return newDroppedItems;
                });
                setAvailableItems((prev) => prev.filter((item) => item.key !== active.id));
            }
        } else {
            setAvailableItems((prev) => {
                setDroppedItems((prevDropped) => {
                    const newDroppedItems = { ...prevDropped };
                    for (const key in newDroppedItems) {
                        if (newDroppedItems[key].some(item => item.key === active.id)) {
                            logRemove(active.id, key);
                        }
                        newDroppedItems[key] = newDroppedItems[key].filter((item) => item.key !== active.id);
                    }
                    return newDroppedItems;
                });
                if (!prev.some((item) => item.key === active.id)) {
                    return [...prev, { bucket: '', key: active.id, url: '' }];
                }
                return prev;
            });
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
            setAvailableItems((prevAvailable) => [...prevAvailable, ...itemsToReAdd.map((item) => ({ bucket: item.bucket, key: item.key, url: '' }))]);
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

    async function fetchMedicalServices(caseGuid: string) {
        const response = await fetch(`/api/services?caseGuid=${caseGuid}`);
        if (!response.ok) {
            throw new Error('Failed to fetch medical services');
        }
        const data = await response.json();
        return data.body;
    }

    async function fetchMedicalServicesAndThumbnails(caseGuid: string) {
        try {
            const [services, thumbnails] = await Promise.all([
                fetchMedicalServices(caseGuid),
                fetchThumbnailURLs(caseGuid),
            ]);

            const newDroppableAreas = services?.map((service: any) => service.guid);
            const newDroppedItems: { [key: string]: { bucket: string, key: string }[] } = {};
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

            const availableItemsSet = new Set(thumbnails.map((item: any) => JSON.stringify(item)));
            services.forEach((service: any) => {
                service?.items?.forEach((item: { bucket: string, key: string }) => {
                    availableItemsSet.delete(JSON.stringify(item));
                });
            });

            setAvailableItems(Array.from(availableItemsSet).map((item: any) => JSON.parse(item)));
        } catch (error) {
            console.error('Error fetching medical services and thumbnails:', error);
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
                    {/*<Button variant="contained" onClick={() => fetchMedicalServicesAndThumbnails(caseGuid)} sx={{ mt: 2 }}>*/}
                    {/*    Fetch Thumbnails*/}
                    {/*</Button>*/}
                </Box>
                <Box>
                    <Typography variant="h6">Medical Services</Typography>
                    <Grid container spacing={2}>
                        {droppableAreas.map((id) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={id}>
                                <SortableContext items={droppedItems[id].map(obj => obj.key)}>
                                    <Droppable id={id} info={droppableInfo[id]} handleInfoChange={handleInfoChange} onDelete={() => handleDeleteDroppable(id)}>
                                        {droppedItems[id]?.map((item, index) => (
                                            <Draggable key={item.key} id={item.key} index={index}>
                                                <img src={availableItems.find(availItem => availItem.bucket === item.bucket && availItem.key === item.key)?.url || ''} alt={item.key} style={{ width: '50px', height: '50px' }} />
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
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.key}>
                                <Draggable id={item.key} index={index}>
                                    <img src={item.url} alt={item.key} style={{ width: '100%' }} />
                                </Draggable>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </DndContext>
    );
}