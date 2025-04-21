import React from "react";

interface InputBoxProps {
    input: string;
    inputType: string;
    onChange: (value: string) => void;
}

export const InputBox: React.FC<InputBoxProps> = ({ input, inputType, onChange }) => (
    <div>
        <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>Input ({inputType})</h2>
        <textarea
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            rows={6}
            value={input}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);
