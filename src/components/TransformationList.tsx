import React from "react";
import { DataType, Step, transformations } from "../utils/transformation";

interface TransformationListProps {
    steps: Step[];
    removeStep: (id: string) => void;
    addStep: (transformation: keyof typeof transformations) => void;
    getValidTransformations: (type: DataType) => { key: string; label: string }[];
    currentType: DataType;
    clearSteps: () => void;
}

export const TransformationList: React.FC<TransformationListProps> = ({
    steps,
    removeStep,
    addStep,
    clearSteps,
    getValidTransformations,
    currentType,
}) => (
    <div style={{ marginTop: "16px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>Transformation Steps</h2>
        {steps.length > 0 && <button onClick={clearSteps}>Clear All Steps</button>}
        <ul style={{ listStyle: "none", padding: 0 }}>
            {steps.map((step, i) => (
                <li key={step.id} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ flexGrow: 1 }}>{transformations[step.transformation].label}</span>
                    {i === steps.length - 1 && (
                        <button
                            onClick={() => removeStep(step.id)}
                            style={{
                                padding: "4px 8px",
                                backgroundColor: "#e74c3c",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                            }}
                        >
                            Remove
                        </button>
                    )}
                </li>
            ))}
        </ul>
        <div style={{ marginTop: "8px" }}>
            <select
                onChange={(e) => e.target.value && addStep(e.target.value as keyof typeof transformations)}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            >
                <option value="">Add Transformation</option>
                {getValidTransformations(currentType).map((t) => (
                    <option key={t.key} value={t.key}>
                        {t.label}
                    </option>
                ))}
            </select>
        </div>
    </div>
);
