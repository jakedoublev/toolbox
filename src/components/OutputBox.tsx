import React from "react";

interface OutputBoxProps {
    output: string;
}

const OutputBox: React.FC<OutputBoxProps> = ({ output }) => (
    <div style={{ marginTop: "16px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>Output</h2>
        <textarea
            style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "#f7f7f7",
            }}
            rows={6}
            readOnly
            value={output}
        />
    </div>
);

export default OutputBox;
