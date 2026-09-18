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
    <div style={{ marginTop: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <label style={{ margin: 0 }}>Steps</label>
            {steps.length > 0 && (
                <button onClick={clearSteps} className="btn btn-sm btn-ghost">Clear All</button>
            )}
        </div>
        <ul className="step-list">
            {steps.map((step, i) => (
                <li key={step.id} className="step-item">
                    <span>{transformations[step.transformation].label}</span>
                    {i === steps.length - 1 && (
                        <button onClick={() => removeStep(step.id)} className="btn btn-sm btn-danger">
                            Remove
                        </button>
                    )}
                </li>
            ))}
        </ul>
        <select
            onChange={(e) => e.target.value && addStep(e.target.value as keyof typeof transformations)}
            value=""
        >
            <option value="">Add transformation...</option>
            {getValidTransformations(currentType).map((t) => (
                <option key={t.key} value={t.key}>
                    {t.label}
                </option>
            ))}
        </select>
    </div>
);
