"use client";

import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Select, MenuItem, FormControl, InputLabel, Drawer, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2'
import MedicalService from '@/app/components/dashboard/services/medicalService';
import MedicalPage from '@/app/components/dashboard/services/medicalPage';
import { createService, updateService, deleteService } from '@/app/lib/servicesCallbacks';
import { v4 as uuidv4 } from 'uuid';
import { useSearchParams } from "next/navigation";
import CloseIcon from '@mui/icons-material/Close';

export default function DnDPage() {
    const [availableItems, setAvailableItems] = useState<{ bucket: string, key: string, url: string }[]>([]);
    const [droppedItems, setDroppedItems] = useState<{ [key: string]: { bucket: string, key: string }[] }>({});
    const [droppableAreas, setDroppableAreas] = useState<string[]>([]);
    const [caseGuid, setCaseGuid] = useState('');
    const [uploadGuid, setUploadGuid] = useState('');
    const [droppableInfo, setDroppableInfo] = useState<{ [key: string]: { date: string, type: string, summary: string } }>({});
    const [showCreateService, setShowCreateService] = useState(false);
    const [zoom, setZoom] = useState<number>(100);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerItems, setDrawerItems] = useState<{ id: string, bucket: string, key: string, url: string }[]>([]);
    const [drawerWidth, setDrawerWidth] = useState<number>(400);

    const searchParams = useSearchParams();

    useEffect(() => {
        const savedZoom = localStorage.getItem('zoom');
        if (savedZoom) {
            setZoom(parseInt(savedZoom, 10));
        }
    }, []);

    useEffect(() => {
        if (searchParams.get("caseGuid")) {
            setCaseGuid(searchParams.get("caseGuid") || "");
        }

        if (searchParams.get('uploadGuid')) {
            setUploadGuid(searchParams.get('uploadGuid') || "")
        }
    }, [searchParams]);

    useEffect(() => {
        if (caseGuid && uploadGuid) {
            fetchMedicalServicesAndThumbnails(caseGuid, uploadGuid).then().catch(err => console.error(err));
        }
    }, [caseGuid, uploadGuid]);

    async function handleAddDroppable() {
        const serviceGuid = uuidv4().toString();
        setDroppableAreas([...droppableAreas, serviceGuid]);
        setDroppedItems((prev) => ({ ...prev, [serviceGuid]: [] }));
        setDroppableInfo((prev) => ({ ...prev, [serviceGuid]: { date: '', type: '', summary: '' } }));
        await createService({ guid: serviceGuid, caseGuid: caseGuid, date: '', type: '', summary: '' });
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
        await updateService({ guid: id, [field]: value });
    }

    async function handleServiceChange(itemId: string, serviceId: string) {
        setDroppedItems((prev) => {
            const newDroppedItems = { ...prev };
            for (const key in newDroppedItems) {
                newDroppedItems[key] = newDroppedItems[key].filter(item => item.key !== itemId);
            }

            // Pluck the object from availableItems with the matching Key.
            const item = availableItems.find(item => item.key == itemId)
            // @ts-ignore
            newDroppedItems[serviceId] = [...(newDroppedItems[serviceId] || []), item];
            updateService({ guid: serviceId, items: newDroppedItems[serviceId] });
            return newDroppedItems;
        });
        setAvailableItems((prev) => prev.filter(item => item.key !== itemId));
    }

    async function fetchThumbnailURLs(caseGuid: string, uploadGuid: string) {
        const response = await fetch(`/api/pages?caseGuid=${caseGuid}&uploadGuid=${uploadGuid}`);
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
    async function fetchMedicalServicesAndThumbnails(caseGuid: string, uploadGuid: string) {
        try {
            const [services, thumbnails] = await Promise.all([
                fetchMedicalServices(caseGuid),
                fetchThumbnailURLs(caseGuid, uploadGuid),
            ]);

            const newDroppableAreas = services?.map((service: any) => service.guid);
            const newDroppedItems: { [key: string]: { bucket: string, key: string, url: string }[] } = {};
            const newDroppableInfo: { [key: string]: { date: string, type: string, summary: string } } = {};

            services.forEach((service: any) => {
                newDroppedItems[service.guid] = service.items.map((item: { bucket: string, key: string }) => {
                    const thumbnail = thumbnails.find((thumb: { key: string }) => thumb.key === item.key);
                    return {
                        ...item,
                        url: thumbnail ? thumbnail.url : ''
                    };
                });
                newDroppableInfo[service.guid] = {
                    date: service.date,
                    type: service.type,
                    summary: service.summary,
                };
            });

            setDroppableAreas(newDroppableAreas);
            setDroppedItems(newDroppedItems);
            setDroppableInfo(newDroppableInfo);

            const assignedKeys = new Set();
            services.forEach((service: any) => {
                service?.items?.forEach((item: { key: string }) => {
                    assignedKeys.add(item.key);
                });
            });

            setAvailableItems(thumbnails.filter((item: { key: string }) => !assignedKeys.has(item.key)));
        } catch (error) {
            console.error('Error fetching medical services and thumbnails:', error);
        }
    }

    const handleZoomChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newZoom = event.target.value as number;
        setZoom(newZoom);
        localStorage.setItem('zoom', newZoom.toString());
    };

    const getGridItemSize = () => {
        if (zoom >= 80) return 12;
        if (zoom >= 60) return 6;
        if (zoom >= 40) return 4;
        return 3;
    };

    const handleOpenDrawer = (items: { id: string, bucket: string, key: string, url: string }[]) => {
        setDrawerItems(items);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        setDrawerWidth(e.clientX);
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
                <TextField
                    label="GUID"
                    value={caseGuid}
                    onChange={(e) => setCaseGuid(e.target.value)}
                    fullWidth
                />
            </Box>
            <Box>
                <Button variant="contained" onClick={handleAddDroppable} sx={{ mb: 2 }}>
                    Create Medical Service
                </Button>
                <Typography variant="h6">Medical Services</Typography>
                <Grid container spacing={2}>
                    {droppableAreas.map((id) => (
                        <Grid size={{xs:12, sm:6, md:4}} key={id}>
                            <MedicalService
                                id={id}
                                info={droppableInfo[id]}
                                items={droppedItems[id]}
                                medicalServices={droppableAreas.map(areaId => ({
                                    id: areaId,
                                    date: droppableInfo[areaId].date,
                                    type: droppableInfo[areaId].type
                                }))}
                                onServiceChange={handleServiceChange}
                                handleInfoChange={handleInfoChange}
                                onDelete={() => handleDeleteDroppable(id)}
                                onOpenDrawer={handleOpenDrawer}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Box>
                <Typography variant="h6">Pages - {availableItems?.length}</Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Zoom</InputLabel>
                    <Select value={zoom} onChange={handleZoomChange}>
                        {[...Array(9)].map((_, i) => (
                            <MenuItem key={i} value={(i + 2) * 10}>{(i + 2) * 10}%</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Grid container spacing={2}>
                    {availableItems.map((item, index) => (
                        <Grid  size={{xs: getGridItemSize()}} key={item.key}>
                            <MedicalPage
                                id={item.key}
                                index={index}
                                medicalServices={droppableAreas.map(areaId => ({
                                    id: areaId,
                                    date: droppableInfo[areaId].date,
                                    type: droppableInfo[areaId].type
                                }))}
                                selectedService=""
                                onServiceChange={handleServiceChange}
                                url={item.url}
                                zoom={zoom}
                            >
                                <img src={item.url} alt={item.key} style={{ width: '100%' }} />
                            </MedicalPage>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={handleCloseDrawer}
                PaperProps={{ style: { width: drawerWidth } }}
                ModalProps={{ keepMounted: true }}
                variant="persistent"
            >
                <Box sx={{ width: '100%', padding: 2, position: 'relative' }}>
                    <IconButton onClick={handleCloseDrawer} sx={{ mb: 2 }}>
                        <CloseIcon />
                    </IconButton>
                    <Box
                        sx={{
                            width: '5px',
                            height: '100%',
                            backgroundColor: 'gray',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            cursor: 'ew-resize',
                        }}
                        onMouseDown={handleMouseDown}
                    />
                    <Grid container spacing={2}>
                        {drawerItems.map((item, index) => (
                            <Grid size={{xs:12}} key={item.key}>
                                <img src={item.url} alt={`Page ${index + 1}`} style={{ width: '100%' }} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Drawer>
        </Box>
    );
}