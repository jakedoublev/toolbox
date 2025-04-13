import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import yaml from "js-yaml";
import InputBox from "../components/InputBox";
import TransformationList from "../components/TransformationList";
import OutputBox from "../components/OutputBox";
import { detectType, transformations, Step, DataType } from "../utils/transformation";

export function Toolbox() {
    const [input, setInput] = useState("");
    const [inputType, setInputType] = useState<"json" | "yaml" | "base64" | "text">("text");
    const [steps, setSteps] = useState<Step[]>([]);
    const [output, setOutput] = useState("");

    useEffect(() => {
        const detected = detectType(input);
        setInputType(detected);
    }, [input]);

    useEffect(() => {
        try {
            let current: any = input;
            let currentType = inputType;

            // Initial parse based on input type
            if (currentType === "json") current = JSON.parse(current);
            if (currentType === "yaml") current = yaml.load(current);
            if (currentType === "base64") current = atob(current);

            // Apply transformations step by step
            for (const step of steps) {
                const t = transformations[step.transformation];

                // Ensure transformation is valid for current type
                if (!t.inputTypes.includes(currentType)) throw new Error("Invalid transformation chain");

                // Apply the transformation
                current = t.fn(current);

                // After applying the transformation, detect type if necessary
                if (typeof current === "string") {
                    // If it's a string, detect if it's JSON or YAML after decoding base64
                    currentType = detectType(current);
                } else {
                    // Otherwise assume it's JSON if it's an object
                    currentType = "json";
                }

                // Special case for minify/pretty-print
                if (currentType === "json" && (step.transformation === "minify" || step.transformation === "prettyPrint")) {
                    // If the value is not valid JSON, reset type to string to prevent further formatting operations
                    try {
                        current = JSON.parse(current); // Attempt parsing to ensure it's valid
                        currentType = "json"; // Reset to JSON if valid
                    } catch {
                        currentType = "text"; // If it's not valid JSON, treat it as plain text
                    }
                }
            }

            // Set the output after transformations
            setOutput(typeof current === "string" ? current : JSON.stringify(current, null, 2));
        } catch (e: any) {
            setOutput(`Error: ${e.message}`);
        }
    }, [input, inputType, steps]);

    const addStep = (transformation: keyof typeof transformations) => {
        setSteps([...steps, { id: uuidv4(), transformation }]);
    };

    const removeStep = (id: string) => {
        setSteps(steps.filter((step) => step.id !== id));
    };

    const getValidTransformations = (type: DataType) => {
        return Object.entries(transformations)
            .filter(([_, t]) => t.inputTypes.includes(type))
            .map(([key, t]) => ({ key, label: t.label }));
    };

    let lastType = inputType;
    try {
        let cur: any = input;
        if (lastType === "json") cur = JSON.parse(cur);
        if (lastType === "yaml") cur = yaml.load(cur);
        if (lastType === "base64") cur = atob(cur);

        for (const step of steps) {
            const t = transformations[step.transformation];
            cur = t.fn(cur);
            // REDETECT type instead of using t.outputType
            if (typeof cur === "string") {
                lastType = detectType(cur);
            } else {
                lastType = "json"; // assume structured objects are JSON
            }
        }
    } catch {}

    return (
        <div style={{ padding: "16px" }}>
            <InputBox input={input} inputType={inputType} onChange={setInput} />
            <TransformationList
                steps={steps}
                removeStep={removeStep}
                addStep={addStep}
                getValidTransformations={getValidTransformations}
                currentType={lastType}
            />
            <OutputBox output={output} />
        </div>
    );
}
