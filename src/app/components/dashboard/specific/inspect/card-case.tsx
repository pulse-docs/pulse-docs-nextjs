'use client';
import {useState} from 'react';
import {copyToClipboard} from "@/app/utils/data.clipboard";
import {Button} from '@/app/components/common/button';
import {Simulate} from "react-dom/test-utils";
import select = Simulate.select;

export function CardCase({claim_id, extent_of_injury, method_of_injury, date_of_injury, questions, sections, text}: {
    claim_id: string,
    extent_of_injury: string,
    method_of_injury: string,
    date_of_injury: string,
    questions: { number: number, question: string, subquestion: number, answer: string }[],
    sections: {
        history: string,
        records: { date: string, description: string }[],
    },
    text: string
}) {
    const [displayRaw, setDisplayRaw] = useState(true);
    const [searchTerm, setSearchTerm] = useState('extent\|intent\|eoi\|moi\|method\|mechanism');
    const [selectedParagraphs, setSelectedParagraphs] = useState<number[]>([]);

    const toggleComponent = () => {
        setDisplayRaw(!displayRaw);
    }

    const toggleParagraphSelection = (index: number) => {
        setSelectedParagraphs(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const copySelectedParagraphs = () => {
        selectedParagraphs.sort((a, b) => a - b);
        const textToCopy = selectedParagraphs.map(index =>
            text.split(/\n{2,}/g)[index].replaceAll('\n', ' ')
        ).join('\n\n');
        copyToClipboard(textToCopy).catch(err => console.error(err));
        setSelectedParagraphs([])
    };

    const regex = new RegExp(`${searchTerm}`, 'gi');
    const highlightText = (text: string) => {
        if (!searchTerm) {
            return text;
        }
        const parts = text.split(' ');
        return parts.map((part, index) => (regex.test(part) ?
            <span key={index} className="bg-yellow-200"> {part} </span> : ` ${part} `));
    };

    const formatParagraph = (text: string) => {
        if (text.trim().match(/^(\*\*.*)/g)) {
            return <p className="font-bold text-lg">{text.replace(/\*/g, '')}</p>
        } else {
            return (
                <div>
                    <p className="pl-3 py-1">{highlightText(text)}</p>
                    <br></br>
                </div>
            )
        }
    }

    const displayText = (text: string) => {
        return text.split(/\n{2,}/g).map((paragraph, index) => (
            <div className={`pl-3 pr-3 py-1 ${selectedParagraphs.includes(index) ? 'bg-blue-100' : ''}`} key={index} onClick={() => toggleParagraphSelection(index)} style={{cursor: 'pointer'}}>
                {formatParagraph(paragraph)}
            </div>
        ));
    }

    const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }

    // return (
    //     <div className="w-full">
    //         <div className="flex w-full items-center justify-between">
    //             <Button onClick={copySelectedParagraphs}>
    //                 Copy Selected Text
    //             </Button>
    //             <div className="w-full">
    //                 <input
    //                     type="text"
    //                     value={searchTerm}
    //                     placeholder="Search text..."
    //                     onChange={handleChangeSearch}
    //                     className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"/>
    //             </div>
    //         </div>
    //         <div
    //             className="max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 my-4">
    //             {displayText(text)}
    //         </div>
    //     </div>
    // );
    return (

        <div className="w-full flex flex-col h-screen">
            <div className="flex w-full items-center justify-between">
                <div className="max-w-4xl mx-auto w-full">
                    <div className="flex flex-col gap-2 md:flex-row md:gap-4 items-center justify-between">
                        <div className="w-full">
                            <input
                                type="text"
                                value={searchTerm}
                                placeholder="Search text..."
                                onChange={handleChangeSearch}
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 shadow-lg"/>
                        </div>
                        <Button onClick={copySelectedParagraphs}>
                            Clipboard
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex flex-grow overflow-hidden">
                <div
                    className="max-w-4xl mx-auto bg-slate-50 shadow-lg rounded-lg overflow-auto border border-gray-50 mt-5">
                    {displayText(text)}
                </div>
            </div>
        </div>
    );
};