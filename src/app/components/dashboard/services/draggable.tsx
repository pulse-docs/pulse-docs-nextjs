import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Card, CardContent, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface DraggableProps {
    id: string;
    children: React.ReactNode;
    index: number;
    showTrashIcon?: boolean;
    onRemove?: () => void;
}

const Draggable: React.FC<DraggableProps> = ({ id, children, index, showTrashIcon, onRemove }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
    const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

    return (
        <Card ref={setNodeRef} sx={style} {...listeners} {...attributes}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2">Page {index + 1}</Typography>
                {showTrashIcon && (
                    <IconButton onClick={onRemove}>
                        <DeleteIcon />
                    </IconButton>
                )}
            </CardContent>
            {children}
        </Card>
    );
};

export default Draggable;