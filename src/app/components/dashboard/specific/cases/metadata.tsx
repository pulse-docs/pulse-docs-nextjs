import {
    Button,
    FormControl,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";

import {CaseData} from '@/app/types/case';

export function MetadataSection(
    { caseData, handleChange, handleSelectChange, handleClickOpen, handleDeleteFile}:
    {
        caseData: CaseData,
        handleChange: (e: { name: string, value: any }) => void,
        handleSelectChange: (e: SelectChangeEvent<{name?: string, value: string | number }>) => void,
        handleClickOpen: () => void,
        handleDeleteFile: (key: string) => void
    })
 {
    return (
        <Grid container spacing={2} mb={2}>
            <Grid size={{xs:12, md:4}}>
                <FormControl fullWidth>
                    <InputLabel>State</InputLabel>
                    <Select name="state" value={{value: caseData.state || ''}} onChange={handleSelectChange}>
                        <MenuItem value="DRAFT">Draft</MenuItem>
                        <MenuItem value="Documents Uploaded">Documents Uploaded</MenuItem>
                        <MenuItem value="Pages Classified">Pages Classified</MenuItem>
                        <MenuItem value="Medical Summary Created">Medical Summary Created</MenuItem>
                        <MenuItem value="Questions Transcribed">Questions Transcribed</MenuItem>
                        <MenuItem value="Review In Progress">Review In Progress</MenuItem>
                        <MenuItem value="Review Completed">Review Completed</MenuItem>
                        <MenuItem value="Approval In Progress">Approval In Progress</MenuItem>
                        <MenuItem value="Approved">Approved</MenuItem>
                        <MenuItem value="Report Generated">Report Generated</MenuItem>
                        <MenuItem value="Report Emailed">Report Emailed</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid size={{xs:12, md:4}}>
                <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select name="priority" value={{ value:caseData.priority}} onChange={handleSelectChange}>
                        <MenuItem value="standard">Standard</MenuItem>
                        <MenuItem value="rush">Rush</MenuItem>
                        <MenuItem value="ludacris">Ludacris</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid size={{xs:12, md:4}}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Due Date"
                        value={caseData.dueDate ? dayjs(caseData.dueDate) : null}
                        onChange={(newValue) => handleChange({name: 'dueDate', value: newValue || ''})}
                        // renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                </LocalizationProvider>
            </Grid>
            <Grid size={{xs:12, md:4}}>
                <FormControl fullWidth>
                    <InputLabel>Analyst</InputLabel>
                    <Select name="analyst" value={{value:caseData.analyst || ''}} onChange={handleSelectChange}>
                        {/* Add options for analysts */}
                    </Select>
                </FormControl>
            </Grid>
            <Grid size={{xs:12, md:4}}>
                <FormControl fullWidth>
                    <InputLabel>Reviewer</InputLabel>
                    <Select name="reviewer" value={{value:caseData.reviewer || ''}} onChange={handleSelectChange}>
                        {/* Add options for reviewers */}
                    </Select>
                </FormControl>
            </Grid>
            <Grid size={{xs:12, md:4}}>
                <FormControl fullWidth>
                    <InputLabel>Approver</InputLabel>
                    <Select name="approver" value={{value:caseData.approver || ''}} onChange={handleSelectChange}>
                        {/* Add options for approvers */}
                    </Select>
                </FormControl>
            </Grid>
            <Grid size={{xs:12, md:4}}>
                <Typography variant="body2">Uploads:</Typography>
                <List>
                    {caseData.uploadDetails?.map((upload, index) => (
                        <ListItem key={index}>
                            <ListItemIcon>
                                <InsertDriveFileIcon />
                            </ListItemIcon>
                            <ListItemText primary={upload.filename} />
                            <IconButton edge="end" onClick={() => handleDeleteFile(upload.key)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            </Grid>
            <Grid size={{xs:12}}>
                <Button variant="contained" fullWidth onClick={handleClickOpen}>Upload</Button>
            </Grid>
        </Grid>
    );
}