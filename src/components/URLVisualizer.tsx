import { useState, useEffect } from "react";
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

const ParamsEditor = ({ type, params, onChange, onRemove, onAdd, newKey, newValue, setNewKey, setNewValue }: ParamsEditorProps) => (
    <div className="param-section">
        <div className="param-section-title">{type === "query" ? "Query" : "Hash"} Parameters</div>
        {Object.keys(params).length === 0 ? (
            <div className="empty-state">None</div>
        ) : (
            Object.entries(params).map(([key, value]) => (
                <div key={key} className="param-row">
                    <span className="param-key">{key}</span>
                    <input type="text" value={value} onChange={(e) => onChange(key, e.target.value)} />
                    <button onClick={() => onRemove(key)} className="btn btn-sm btn-danger">–</button>
                </div>
            ))
        )}
        <div className="param-row">
            <input type="text" placeholder="key" value={newKey} onChange={(e) => setNewKey(e.target.value)} />
            <input type="text" placeholder="value" value={newValue} onChange={(e) => setNewValue(e.target.value)} />
            <button
                onClick={() => { if (newKey.trim()) { onAdd(newKey, newValue); setNewKey(""); setNewValue(""); } }}
                className="btn btn-sm btn-primary"
            >+</button>
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
        <div className="card">
            <div className="card-title">URL Inspector</div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "start" }}>
                <input id="url-input" type="text" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="Paste a URL..." />
                {urlInput !== "" && <CopyButton content={urlInput} />}
            </div>
            {urlObject && (
                <div style={{ marginTop: "0.75rem" }}>
                    <div className="url-parts">
                        <div><strong>Origin</strong> <span>{urlObject.origin}</span></div>
                        <div><strong>Host</strong> <span>{urlObject.host}</span></div>
                        <div><strong>Path</strong> <span>{urlObject.pathname}</span></div>
                    </div>
                    <ParamsEditor
                        type="query" params={queryParams}
                        onChange={(key, value) => { const updated = { ...queryParams, [key]: value }; setQueryParams(updated); updateUrlInput(updated, hashParams); }}
                        onRemove={(key) => { const updated = { ...queryParams }; delete updated[key]; setQueryParams(updated); updateUrlInput(updated, hashParams); }}
                        onAdd={(key, value) => { const updated = { ...queryParams, [key]: value }; setQueryParams(updated); updateUrlInput(updated, hashParams); }}
                        newKey={newQueryKey} newValue={newQueryValue} setNewKey={setNewQueryKey} setNewValue={setNewQueryValue}
                    />
                    <ParamsEditor
                        type="hash" params={hashParams}
                        onChange={(key, value) => { const updated = { ...hashParams, [key]: value }; setHashParams(updated); updateUrlInput(queryParams, updated); }}
                        onRemove={(key) => { const updated = { ...hashParams }; delete updated[key]; setHashParams(updated); updateUrlInput(queryParams, updated); }}
                        onAdd={(key, value) => { const updated = { ...hashParams, [key]: value }; setHashParams(updated); updateUrlInput(queryParams, updated); }}
                        newKey={newHashKey} newValue={newHashValue} setNewKey={setNewHashKey} setNewValue={setNewHashValue}
                    />
                </div>
            )}
        </div>
    );
};

export default URLVisualizer;
