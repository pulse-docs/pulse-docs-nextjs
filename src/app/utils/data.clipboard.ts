/*
Use this function to copy text to clipboard
Add as param: onClick={()=>copyToClipboard(obj.extent_of_injury)} style={{cursor: 'pointer'}}
*/
export async function copyToClipboard(text: string) {
    const processedText = text.trim() // Whitespace at the beginning and end of the text
        .replace(/<\/?[^>]+(>|$)/g, "") // HTML tags
        .replace(/\*+/g, ''); // Asterisks
    console.log(processedText)

    if (navigator.clipboard) {
        navigator.clipboard.writeText(processedText).then(() => {
            console.log('Text copied to clipboard');
            console.log(text)
            // Optionally, you can add user feedback here
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    } else {
        // Fallback for browsers that do not support the Clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = processedText;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            console.log('Text copied to clipboard');
            // Optionally, you can add user feedback here
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
        document.body.removeChild(textArea);
    }
};

