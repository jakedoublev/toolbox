import { CopyButton } from "./CopyButton";

type OutputBoxProps = {
    output: string;
};

export function OutputBox({ output }: OutputBoxProps) {
    return (
        <div style={{ marginTop: "1rem" }}>
            <div className="output-header">
                <h3>Output</h3>
                <CopyButton content={output} />
            </div>
            <textarea readOnly value={output} rows={8} />
        </div>
    );
}
