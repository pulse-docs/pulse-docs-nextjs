import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemIcon, ListItemText,
    Typography
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";




export function DialogModal({ open, handleClose, handleFileChange, uploadStatus, files, guidCase, userId }: {
    open: boolean,
    handleClose: () => void,
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    uploadStatus: string | null,
    files: FileList | null,
    guidCase: string,
    userId: string
}) {
    console.log('Upload Modal: guidCase:', guidCase);
    const uploadLargeFile = async () => {
        if (!files) return;
        const file = files[0];
        const chunkSize = 5 * 1024 * 1024; // 5MB chunks
        const numChunks = Math.ceil(file.size / chunkSize);
        const uploadedParts: { ETag: string; PartNumber: any; }[] = [];
        const concurrency = 5;

        // Step 1: Initialize multipart upload
        const initResponse = await fetch("/api/upload-multipart", {
            method: "POST",
            body: JSON.stringify({ fileName: file.name, fileType: file.type, guidCase: guidCase}),
            headers: { "Content-Type": "application/json" },
        });

        const { uploadId, key } = await initResponse.json();

        // Step 2: Create an array of chunk upload promises
        let activeUploads = 0;
        const uploadQueue = Array.from({ length: numChunks }, (_, i) => i + 1);
        const uploadTasks = [];

        const uploadChunk = async (partNumber: number) => {
            const start = (partNumber - 1) * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            const fileChunk = file.slice(start, end);

            // Get signed URL for this chunk
            const partResponse = await fetch("/api/upload-part", {
                method: "POST",
                body: JSON.stringify({ fileName: file.name, uploadId, partNumber, key }),
                headers: { "Content-Type": "application/json" },
            });

            const { url } = await partResponse.json();

            // Upload chunk to S3
            const uploadResponse = await fetch(url, {
                method: "PUT",
                body: fileChunk,
                headers: { "Content-Type": file.type },
            });

            if (!uploadResponse.ok) {
                throw new Error(`Failed to upload chunk ${partNumber}`);
            }

            const etag = uploadResponse.headers.get("ETag");
            if (etag) {
                uploadedParts.push({ ETag: etag, PartNumber: partNumber });
            }

            return partNumber;
        };

        // Run uploads with limited concurrency
        while (uploadQueue.length > 0 || activeUploads > 0) {
            while (activeUploads < concurrency && uploadQueue.length > 0) {
                const partNumber = uploadQueue.shift();
                if (partNumber) {
                    activeUploads++;
                    const uploadPromise = uploadChunk(partNumber)
                        .then(() => activeUploads--)
                        .catch((error) => console.error(`Chunk ${partNumber} failed:`, error));
                    uploadTasks.push(uploadPromise);
                }
            }
            await Promise.race(uploadTasks);
        }

        // Wait for all uploads to finish
        await Promise.all(uploadTasks);

        // Step 3: Complete the multipart upload
        await fetch("/api/upload-complete", {
            method: "POST",
            body: JSON.stringify({ fileName: file.name, uploadId, parts: uploadedParts, key, guidCase: guidCase, uploadedBy: userId }),
            headers: { "Content-Type": "application/json" },
        });

        console.log("File uploaded successfully!");
        handleClose();
    }
    // const handleUpload = async() => {
    //
    //     if (!files) return;
    //     const file = files[0];
    //     const chunkSize = 5 * 1024 * 1024; // 5MB chunks
    //     const numChunks = Math.ceil(file.size / chunkSize);
    //
    //     // Step 1: Initialize multipart upload
    //     const initResponse = await fetch("/api/upload-multipart", {
    //         method: "POST",
    //         body: JSON.stringify({ fileName: file.name, fileType: file.type }),
    //         headers: { "Content-Type": "application/json" },
    //     });
    //
    //     const { uploadId } = await initResponse.json();
    //     const uploadedParts = [];
    //
    //     // Step 2: Upload each chunk
    //     for (let i = 0; i < numChunks; i++) {
    //         const start = i * chunkSize;
    //         const end = Math.min(start + chunkSize, file.size);
    //         const fileChunk = file.slice(start, end);
    //
    //         // Get pre-signed URL for this chunk
    //         const partResponse = await fetch("/api/upload-part", {
    //             method: "POST",
    //             body: JSON.stringify({ fileName: file.name, uploadId, partNumber: i + 1 }),
    //             headers: { "Content-Type": "application/json" },
    //         });
    //
    //         const { url } = await partResponse.json();
    //
    //         // Upload chunk directly to S3
    //         const uploadResponse = await fetch(url, {
    //             method: "PUT",
    //             body: fileChunk,
    //             headers: { "Content-Type": file.type },
    //         });
    //
    //         if (!uploadResponse.ok) throw new Error(`Failed to upload chunk ${i + 1}`);
    //         uploadedParts.push({ ETag: uploadResponse.headers.get("ETag"), PartNumber: i + 1 });
    //     }
    //
    //     // Step 3: Complete the upload
    //     await fetch("/api/upload-complete", {
    //         method: "POST",
    //         body: JSON.stringify({ fileName: file.name, uploadId, parts: uploadedParts }),
    //         headers: { "Content-Type": "application/json" },
    //     });
    //
    //     console.log("File uploaded successfully!");
    // }




    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Upload Documents (miles)</DialogTitle>
            <DialogContent>
                <Typography>Select file to upload:</Typography>
                <input type="file" onChange={handleFileChange} />
                {uploadStatus && <Typography>{uploadStatus}</Typography>}
                <List>
                    {files && Array.from(files).map((file) => (
                        <ListItem key={file.name}>
                            <ListItemIcon>
                                <InsertDriveFileIcon />
                            </ListItemIcon>
                            <ListItemText primary={file.name} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">Cancel</Button>
                <Button
                    // onClick={handleUpload}
                    onClick={uploadLargeFile}
                    variant="contained"
                    color="primary"
                    disabled={!files}
                >
                    Upload
                </Button>
            </DialogActions>
        </Dialog>
    );
}
