import React from "react";
import { Toolbox } from "./pages/ToolBox";
import UUIDGenerator from "./components/UUIDGenerator";

const App: React.FC = () => {
    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
            <h1 style={{ textAlign: "center" }}>Transformation Toolbox</h1>
            <div style={{ display: "flex", width: "100%" }}>
                <UUIDGenerator />
                <Toolbox />
            </div>
        </div>
    );
};

export default App;
