import React from "react";
import { Toolbox } from "./pages/ToolBox";

const App: React.FC = () => {
    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
            <h1 style={{ textAlign: "center" }}>Transformation Toolbox</h1>
            <Toolbox />
        </div>
    );
};

export default App;
