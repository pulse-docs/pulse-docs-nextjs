//
export type Case = {
    _id: string;
    case_id: string;
    documents: Document[];
    peer_review: PeerReview
    status: string;
    created_by: string;
    created_at: string;
    updated_at: string;
}

export type Document = {
    bucket: string;
    key: string;
    file_id: string;
    content_summary: string;
    state: string
    metadata: DocumentMetadata
}

export type DocumentMetadata = {
    type: string
    date: string
    icd_codes: string[]
}

export type Record = {
    date: string;
    visit_type: string;
    icd_codes: string[];
    text: string;
}

export type Question = {
    question: string;
    answer: string;
    edits:  Edit[];
}

export type Edit = {
    timestamp: string;
    user_id: string;
}

export type PeerReview = {
    history: string
    records: Record[]
    questions: Question[]
    status: string
    created_by: string
    created_at: string
    updated_at: string
}