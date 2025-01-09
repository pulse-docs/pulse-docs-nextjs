import dayjs, {Dayjs} from "dayjs";
import {v4 as uuidv4} from 'uuid';

export interface CaseData {
    _id: string;
    createdAt: number;
    guid: string;
    state: string;
    history: string;
    recordsReviewed: Record[];
    questions: Question[];
    dueDate: number;
    priority: string;
    analyst?: string;
    reviewer?: string;
    approver?: string;
    uploadDetails?: { filename: string; guidUpload: string; key: string }[];
}

export function createCaseData(): CaseData {
    return {
        _id: '',
        createdAt: Date.now(),
        guid: uuidv4().toString(),
        state: 'DRAFT',
        history: '',
        recordsReviewed: [],
        questions: [],
        dueDate: dayjs().valueOf(),
        priority: '',
        analyst: '',
        reviewer: '',
        approver: '',
        uploadDetails: []
    }
}

export interface Question {
    id: number;
    question: string;
    response?: string;
}

export interface Record {
    id: number;
    date: Dayjs;
    type: string;
    description: string;
}