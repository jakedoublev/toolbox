import { CopyButton } from "./CopyButton";

type OutputBoxProps = {
    output: string;
};

export function OutputBox({ output }: OutputBoxProps) {
    return (
        <div style={{ marginTop: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>Output</h3>
                <CopyButton content={output} />
            </div>
            <textarea
                readOnly
                value={output}
                style={{ width: "100%", height: "200px", fontFamily: "monospace", marginTop: "8px" }}
            />
        </div>
    );
}
