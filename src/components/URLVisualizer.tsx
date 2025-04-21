import { useState, useEffect, CSSProperties } from "react";
import { CopyButton } from "./CopyButton";

const parseParams = (paramString: string): Record<string, string> => {
    const params = new URLSearchParams(paramString);
    const result: Record<string, string> = {};
    for (const [key, value] of params.entries()) {
        result[key] = decodeURIComponent(value);
    }
    return result;
};

const stringifyParams = (params: Record<string, string>): string => {
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (key.trim() !== "") {
            urlParams.set(key, encodeURIComponent(value));
        }
    });
    return urlParams.toString();
};

const styles: Record<string, CSSProperties> = {
    container: {
        maxWidth: "600px",
        margin: "2rem auto",
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "6px",
        fontFamily: "sans-serif",
    },
    inputGroup: {
        marginBottom: "1rem",
    },
    input: {
        width: "95%",
        padding: "0.5rem",
        marginTop: "0.25rem",
        marginBottom: "0.5rem",
        border: "1px solid #aaa",
        borderRadius: "4px",
    },
    button: {
        padding: "0.5rem 1rem",
        fontWeight: "bold",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    buttonHover: {
        backgroundColor: "#0056b3",
    },
    section: {
        marginTop: "1rem",
    },
    paramItem: {
        display: "flex",
        alignItems: "center",
        marginBottom: "0.5rem",
    },
    label: {
        width: "100px",
        fontFamily: "monospace",
        fontWeight: "bold",
    },
    paramInput: {
        flex: 1,
        padding: "0.4rem",
        border: "1px solid #aaa",
        borderRadius: "4px",
    },
    empty: {
        fontStyle: "italic",
        color: "#777",
    },
};

interface ParamsEditorProps {
    type: "query" | "hash";
    params: Record<string, string>;
    onChange: (key: string, value: string) => void;
    onRemove: (key: string) => void;
    onAdd: (key: string, value: string) => void;
    newKey: string;
    newValue: string;
    setNewKey: (val: string) => void;
    setNewValue: (val: string) => void;
}

const ParamsEditor = ({
    type,
    params,
    onChange,
    onRemove,
    onAdd,
    newKey,
    newValue,
    setNewKey,
    setNewValue,
}: ParamsEditorProps) => (
    <div style={styles.section}>
        <strong>{type === "query" ? "Query" : "Hash"} Parameters:</strong>
        {Object.keys(params).length === 0 ? (
            <div style={styles.empty}>None</div>
        ) : (
            Object.entries(params).map(([key, value]) => (
                <div key={key} style={styles.paramItem}>
                    <label style={styles.label}>{key}</label>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(key, e.target.value)}
                        style={styles.paramInput}
                    />
                    <button
                        onClick={() => onRemove(key)}
                        style={{ ...styles.button, backgroundColor: "#eb3f59", marginLeft: "8px" }}
                    >
                        –
                    </button>
                </div>
            ))
        )}
        <div style={styles.paramItem}>
            <input placeholder="key" value={newKey} onChange={(e) => setNewKey(e.target.value)} style={styles.paramInput} />
            <input
                placeholder="value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                style={{ ...styles.paramInput, marginLeft: "8px" }}
            />
            <button
                onClick={() => {
                    if (newKey.trim()) {
                        onAdd(newKey, newValue);
                        setNewKey("");
                        setNewValue("");
                    }
                }}
                style={{ ...styles.button, marginLeft: "8px" }}
            >
                +
            </button>
        </div>
    </div>
);

const URLVisualizer = () => {
    const [urlInput, setUrlInput] = useState<string>("");
    const [urlObject, setUrlObject] = useState<URL | null>(null);
    const [queryParams, setQueryParams] = useState<Record<string, string>>({});
    const [hashParams, setHashParams] = useState<Record<string, string>>({});
    const [newQueryKey, setNewQueryKey] = useState("");
    const [newQueryValue, setNewQueryValue] = useState("");
    const [newHashKey, setNewHashKey] = useState("");
    const [newHashValue, setNewHashValue] = useState("");

    useEffect(() => {
        try {
            const parsed = new URL(urlInput);
            setUrlObject(parsed);
            setQueryParams(parseParams(parsed.search));
            setHashParams(parseParams(parsed.hash.startsWith("#") ? parsed.hash.slice(1) : parsed.hash));
        } catch {
            setUrlObject(null);
            setQueryParams({});
            setHashParams({});
        }
    }, [urlInput]);

    const updateUrlInput = (updatedQueryParams: Record<string, string>, updatedHashParams: Record<string, string>) => {
        if (urlObject) {
            const updatedUrl = new URL(urlObject.toString());
            updatedUrl.search = stringifyParams(updatedQueryParams);
            updatedUrl.hash = stringifyParams(updatedHashParams);
            setUrlInput(updatedUrl.toString());
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.inputGroup}>
                <label htmlFor="url-input">URL Input</label>
                <input
                    id="url-input"
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    style={styles.input}
                />
                <CopyButton content={urlInput} />
            </div>

            {urlObject && (
                <div>
                    <div>
                        <strong>Origin:</strong> {urlObject.origin}
                    </div>
                    <div>
                        <strong>Host:</strong> {urlObject.host}
                    </div>
                    <div>
                        <strong>Path:</strong> {urlObject.pathname}
                    </div>

                    <ParamsEditor
                        type="query"
                        params={queryParams}
                        onChange={(key, value) => {
                            const updated = { ...queryParams, [key]: value };
                            setQueryParams(updated);
                            updateUrlInput(updated, hashParams);
                        }}
                        onRemove={(key) => {
                            const updated = { ...queryParams };
                            delete updated[key];
                            setQueryParams(updated);
                            updateUrlInput(updated, hashParams);
                        }}
                        onAdd={(key, value) => {
                            const updated = { ...queryParams, [key]: value };
                            setQueryParams(updated);
                            updateUrlInput(updated, hashParams);
                        }}
                        newKey={newQueryKey}
                        newValue={newQueryValue}
                        setNewKey={setNewQueryKey}
                        setNewValue={setNewQueryValue}
                    />

                    <ParamsEditor
                        type="hash"
                        params={hashParams}
                        onChange={(key, value) => {
                            const updated = { ...hashParams, [key]: value };
                            setHashParams(updated);
                            updateUrlInput(queryParams, updated);
                        }}
                        onRemove={(key) => {
                            const updated = { ...hashParams };
                            delete updated[key];
                            setHashParams(updated);
                            updateUrlInput(queryParams, updated);
                        }}
                        onAdd={(key, value) => {
                            const updated = { ...hashParams, [key]: value };
                            setHashParams(updated);
                            updateUrlInput(queryParams, updated);
                        }}
                        newKey={newHashKey}
                        newValue={newHashValue}
                        setNewKey={setNewHashKey}
                        setNewValue={setNewHashValue}
                    />
                </div>
            )}
        </div>
    );
};

export default URLVisualizer;
