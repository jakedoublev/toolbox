import React, { useState, useEffect, CSSProperties } from "react";

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
        urlParams.set(key, encodeURIComponent(value));
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

const URLVisualizer: React.FC = () => {
    const [urlInput, setUrlInput] = useState<string>("");
    const [urlObject, setUrlObject] = useState<URL | null>(null);
    const [queryParams, setQueryParams] = useState<Record<string, string>>({});
    const [hashParams, setHashParams] = useState<Record<string, string>>({});

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

    const handleParamChange = (type: "query" | "hash", key: string, value: string) => {
        const newParams = {
            ...(type === "query" ? queryParams : hashParams),
            [key]: value,
        };
        if (type === "query") {
            setQueryParams(newParams);
        } else {
            setHashParams(newParams);
        }

        if (urlObject) {
            const updatedUrl = new URL(urlObject.toString());
            updatedUrl.search = stringifyParams(type === "query" ? newParams : queryParams);
            updatedUrl.hash = stringifyParams(type === "hash" ? newParams : hashParams);
            setUrlInput(updatedUrl.toString());
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(urlInput);
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
                <button onClick={copyToClipboard} style={styles.button}>
                    Copy URL
                </button>
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

                    <div style={styles.section}>
                        <strong>Query Parameters:</strong>
                        {Object.keys(queryParams).length === 0 ? (
                            <div style={styles.empty}>None</div>
                        ) : (
                            Object.entries(queryParams).map(([key, value]) => (
                                <div key={key} style={styles.paramItem}>
                                    <label style={styles.label}>{key}</label>
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => handleParamChange("query", key, e.target.value)}
                                        style={styles.paramInput}
                                    />
                                </div>
                            ))
                        )}
                    </div>

                    <div style={styles.section}>
                        <strong>Hash Parameters:</strong>
                        {Object.keys(hashParams).length === 0 ? (
                            <div style={styles.empty}>None</div>
                        ) : (
                            Object.entries(hashParams).map(([key, value]) => (
                                <div key={key} style={styles.paramItem}>
                                    <label style={styles.label}>{key}</label>
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => handleParamChange("hash", key, e.target.value)}
                                        style={styles.paramInput}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default URLVisualizer;
