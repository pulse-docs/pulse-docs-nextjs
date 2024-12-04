'use client';
export default function TextArea({value, cb}: {
    value: string,
    cb: Function
}) {

    const handleChange = (e: any) => {
        cb(e.target.value);
    }

    return (
        <div className="flex w-full">
            <textarea
                value={value}
                placeholder={"Paste history and records reviewed..."}
                className="w-full h-[300px] p-2 border border-gray-200 rounded-md resize-none select-text"
                onChange={(e) => handleChange(e)}
                style={{userSelect: 'text'}}
                ></textarea>
        </div>
    );
}