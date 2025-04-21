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
            alert("Failed to copy UUID to clipboard.");
        }
    };

    return (
        <button
            onClick={copyToClipboard}
            style={{
                padding: "0.5rem 1rem",
                fontWeight: "bold",
                backgroundColor: copied ? "#7da87d" : "#1ca31e",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
            }}
        >
            {copied ? "Copied!" : "Copy"}
        </button>
    );
};
