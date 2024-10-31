export type Case = {
    case_id: string;
    records: Record[],
    questions: Question[],
    history: CaseHistory,
    state: string,
    created_at: number,
    created_by: string

}

export type Record = {
    record_id: string,
    type: string,
    date: string,
    description: string,
}

export type Question = {
    question: string,
    response: string,
    order: number,
}

export type CaseHistory = {
    description: string,
}