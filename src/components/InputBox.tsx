import React from "react";

interface InputBoxProps {
    input: string;
    inputType: string;
    onChange: (value: string) => void;
}

export const InputBox: React.FC<InputBoxProps> = ({ input, inputType, onChange }) => (
    <div>
        <label>Input ({inputType})</label>
        <textarea
            rows={6}
            value={input}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste JSON, YAML, Base64, or text..."
        />
    </div>
);
