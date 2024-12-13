import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Card, CardContent, Typography } from '@mui/material';

interface DraggableProps {
    id: string;
    children: React.ReactNode;
    index: number;
}

const Draggable: React.FC<DraggableProps> = ({ id, children, index }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
    const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

    return (
        <Card ref={setNodeRef} sx={style} {...listeners} {...attributes}>
            <CardContent>
                <Typography variant="body2">Page {index + 1}</Typography>
                {children}
            </CardContent>
        </Card>
    );
};

export default Draggable;