// src/app/services/serviceCallbacks.ts

export async function createService(serviceData: any) {
    try {
        const response = await fetch('/api/services', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(serviceData),
        });
        if (!response.ok) {
            throw new Error('Failed to create service');
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating service:', error);
    }
}

export async function updateService(serviceData: any) {
    console.log(serviceData);
    try {
        const response = await fetch(`/api/services?guid=${serviceData.guid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(serviceData),
        });
        if (!response.ok) {
            throw new Error('Failed to update service');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating service:', error);
    }
}

export async function deleteService(guid: string) {
    try {
        const response = await fetch(`/api/services?guid=${guid}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete service');
        }
    } catch (error) {
        console.error('Error deleting service:', error);
    }
}