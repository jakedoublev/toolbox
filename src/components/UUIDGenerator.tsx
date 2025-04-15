import { useState } from "react";
import { v4 as uuidv4, v6 as uuidv6 } from "uuid";
import { Switch } from "@headlessui/react";

const UUIDGenerator = () => {
    const [uuid, setUuid] = useState(uuidv4());
    const [version, setVersion] = useState("v4");
    const [copied, setCopied] = useState(false);

    const generateUUID = () => {
        if (version === "v4") {
            setUuid(uuidv4());
        } else if (version === "v6") {
            setUuid(uuidv6());
        }
        setCopied(false);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(uuid);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy: ", err);
            alert("Failed to copy UUID to clipboard.");
        }
    };

    const toggleVersion = () => {
        const newVersion = version === "v4" ? "v6" : "v4";
        setVersion(newVersion);
        generateUUID();
    };

    return (
        <div style={{ marginTop: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>UUID Generator</h2>
            <div style={{ marginTop: "8px" }}>
                <p style={{ fontSize: "14px", color: "#718096" }}>Generated UUID ({version}):</p>
                <pre
                    style={{
                        padding: "8px",
                        backgroundColor: "#edf2f7",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontFamily: "monospace",
                        wordBreak: "break-all",
                        color: "#4a5568",
                    }}
                >
                    {uuid}
                </pre>
            </div>

            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button
                    onClick={generateUUID}
                    style={{
                        padding: "4px 8px",
                        backgroundColor: "#3182ce",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                    }}
                >
                    Generate
                </button>
                <button
                    onClick={copyToClipboard}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor: copied ? "#48bb78" : "#38a169",
                        color: "#fff",
                        border: "none",
                    }}
                >
                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "8px" }}>
                <Switch
                    checked={version === "v6"}
                    onChange={toggleVersion}
                    className="relative inline-flex h-6 w-11 items-center rounded-full"
                    style={{
                        position: "relative",
                        display: "inline-flex",
                        height: "24px",
                        width: "44px",
                        alignItems: "center",
                        borderRadius: "100px",
                        transition: "background-color 0.2s ease",
                        backgroundColor: version === "v6" ? "#3b82f6" : "#d1d5db",
                        outline: "none",
                    }}
                >
                    <span
                        className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out"
                        style={{
                            display: "inline-block",
                            height: "16px",
                            width: "16px",
                            transform: version === "v6" ? "translateX(20px)" : "translateX(4px)",
                            borderRadius: "100px",
                            backgroundColor: "#fff",
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                        }}
                    />
                </Switch>
                <span style={{ fontSize: "14px", fontWeight: "medium", color: "#2d3748" }}>Use v6</span>
            </div>
        </div>
    );
};

export default UUIDGenerator;
