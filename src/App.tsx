import React from "react";
import { TransformationPipeline } from "./containers/TransformationPipeline";
import { UUIDGenerator } from "./components/UUIDGenerator";
import URLVisualizer from "./components/URLVisualizer";

const App: React.FC = () => {
    return (
        <div className="app">
            <header className="app-header">
                <h1>Toolbox</h1>
                <p>UUID generation, URL inspection, and data transformation</p>
            </header>
            <div className="app-grid">
                <UUIDGenerator />
                <URLVisualizer />
                <TransformationPipeline />
            </div>
        </div>
    );
};

export default App;
