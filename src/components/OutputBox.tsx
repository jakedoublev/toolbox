import React, { useState } from "react";

type OutputBoxProps = {
    output: string;
};

export default function OutputBox({ output }: OutputBoxProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div style={{ marginTop: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>Output</h3>
                <button onClick={handleCopy} style={{ padding: "4px 8px", fontSize: "0.9rem" }}>
                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>
            <textarea
                readOnly
                value={output}
                style={{ width: "100%", height: "200px", fontFamily: "monospace", marginTop: "8px" }}
            />
        </div>
    );
}
