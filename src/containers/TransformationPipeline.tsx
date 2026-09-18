import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import yaml from "js-yaml";

import { InputBox } from "../components/InputBox";
import { TransformationList } from "../components/TransformationList";
import { OutputBox } from "../components/OutputBox";
import { detectType, transformations, Step, DataType } from "../utils/transformation";

export function TransformationPipeline() {
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

            if (currentType === "json") current = JSON.parse(current);
            if (currentType === "yaml") current = yaml.load(current);
            if (currentType === "base64") current = atob(current);

            for (const step of steps) {
                const t = transformations[step.transformation];
                current = t.fn(current);
                currentType = t.outputType;
            }

            let finalOutput = current;
            if (typeof current === "object" && current !== null) {
                finalOutput = JSON.stringify(current, null, 2);
            }

            setOutput(finalOutput);
        } catch (e: any) {
            setOutput(`Error: ${e.message}`);
        }
    }, [input, inputType, steps]);

    const addStep = (transformation: keyof typeof transformations) => {
        setSteps([...steps, { id: uuidv4(), transformation }]);
    };

    const removeStep = (id: string) => {
        if (steps.length > 0 && steps[steps.length - 1].id === id) {
            setSteps(steps.slice(0, steps.length - 1));
        }
    };

    const getValidTransformations = (type: DataType) => {
        return Object.entries(transformations)
            .filter(([_, t]) => t.inputTypes.includes(type))
            .map(([key, t]) => ({ key, label: t.label }));
    };

    const clearSteps = () => setSteps([]);

    let lastType = inputType;
    try {
        let cur: any = input;
        if (lastType === "json") cur = JSON.parse(cur);
        if (lastType === "yaml") cur = yaml.load(cur);
        if (lastType === "base64") cur = atob(cur);

        for (const step of steps) {
            const t = transformations[step.transformation];
            cur = t.fn(cur);
            if (typeof cur === "string") {
                lastType = detectType(cur);
            } else {
                lastType = "json";
            }
        }
    } catch {}

    return (
        <div className="card full-width">
            <div className="card-title">Data Transformer</div>
            <InputBox input={input} inputType={inputType} onChange={setInput} />
            <TransformationList
                steps={steps}
                removeStep={removeStep}
                addStep={addStep}
                clearSteps={clearSteps}
                getValidTransformations={getValidTransformations}
                currentType={lastType}
            />
            <OutputBox output={output} />
        </div>
    );
}
