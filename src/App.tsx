import React from "react";
import { TransformationPipeline } from "./containers/TransformationPipeline";
import { UUIDGenerator } from "./components/UUIDGenerator";
import URLVisualizer from "./components/URLVisualizer";

const App: React.FC = () => {
    return (
        <>
            <div style={{ maxWidth: "100%", margin: "0 auto", padding: "20px" }}>
                <h1 style={{ textAlign: "center" }}>Transformation Toolbox</h1>
                <div style={{ display: "flex", width: "100%" }}>
                    <div style={{ width: "60%" }}>
                        <UUIDGenerator />
                        <URLVisualizer />
                    </div>
                    <TransformationPipeline />
                </div>
            </div>
        </>
    );
};

export default App;
