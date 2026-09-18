import { useState } from "react";
import { v4 as uuidv4, v6 as uuidv6 } from "uuid";
import { Switch } from "@headlessui/react";
import { CopyButton } from "./CopyButton";

export const UUIDGenerator = () => {
    const [uuid, setUuid] = useState(uuidv4());
    const [version, setVersion] = useState("v4");

    const generateUUID = () => {
        if (version === "v4") {
            setUuid(uuidv4());
        } else if (version === "v6") {
            setUuid(uuidv6());
        }
    };

    const toggleVersion = () => {
        const newVersion = version === "v4" ? "v6" : "v4";
        setVersion(newVersion);
        setUuid(newVersion === "v4" ? uuidv4() : uuidv6());
    };

    return (
        <div className="card">
            <div className="card-title">UUID Generator ({version})</div>
            <div className="code-display">{uuid}</div>
            <div className="btn-row" style={{ marginTop: "0.75rem" }}>
                <button onClick={generateUUID} className="btn btn-primary">
                    Generate
                </button>
                <CopyButton content={uuid} />
            </div>
            <div className="toggle-row">
                <Switch
                    checked={version === "v6"}
                    onChange={toggleVersion}
                    className="toggle-track"
                    style={{
                        backgroundColor: version === "v6" ? "var(--color-primary)" : "var(--color-border)",
                    }}
                >
                    <span
                        className="toggle-thumb"
                        style={{
                            transform: version === "v6" ? "translateX(20px)" : "translateX(2px)",
                        }}
                    />
                </Switch>
                <span className="toggle-label">Use v6</span>
            </div>
        </div>
    );
};
