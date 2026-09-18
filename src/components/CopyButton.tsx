import { useState } from "react";

interface CopyButtonProps {
    content: string;
}

export const CopyButton = ({ content }: CopyButtonProps) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    };

    return (
        <button
            onClick={copyToClipboard}
            className={`btn btn-sm ${copied ? "btn-success" : "btn-ghost"}`}
        >
            {copied ? "Copied" : "Copy"}
        </button>
    );
};
