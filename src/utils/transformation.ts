import yaml from "js-yaml";

export type DataType = "json" | "yaml" | "base64" | "text";

export const transformations: {
    [key: string]: {
        label: string;
        fn: (input: any) => any;
        inputTypes: DataType[];
        outputType: DataType;
    };
} = {
    encodeBase64: {
        label: "Encode to Base64",
        fn: (input: any) => {
            // Ensure the input is a string or serialize it to string
            try {
                return btoa(typeof input === "string" ? input : JSON.stringify(input));
            } catch (e) {
                throw new Error("Invalid input for Base64 encoding.");
            }
        },
        inputTypes: ["json", "text", "yaml"],
        outputType: "base64",
    },
    decodeBase64: {
        label: "Decode Base64",
        fn: (input: any) => {
            try {
                // Handle Base64 decoding
                const decoded = atob(input);
                return decoded; // Return as string
            } catch (e) {
                throw new Error("Invalid Base64 input.");
            }
        },
        inputTypes: ["base64"],
        outputType: "text",
    },
    convertToYAML: {
        label: "Convert to YAML",
        fn: (input: any) => {
            try {
                return yaml.dump(input);
            } catch (e) {
                throw new Error("Error converting to YAML.");
            }
        },
        inputTypes: ["json"],
        outputType: "yaml",
    },
    convertToJSON: {
        label: "Convert to JSON",
        fn: (input: any) => {
            try {
                return JSON.stringify(yaml.load(input), null, 2);
            } catch (e) {
                throw new Error("Error converting to JSON from YAML.");
            }
        },
        inputTypes: ["yaml"],
        outputType: "json",
    },
    minify: {
        label: "Minify JSON",
        fn: (input: any) => {
            // Check if input is a stringified JSON, then parse it first
            try {
                // If it's a string, try to parse it as JSON
                if (typeof input === "string") {
                    input = JSON.parse(input);
                }
                // Now minify the JSON object (stringify it without spaces)
                return JSON.stringify(input);
            } catch (e) {
                throw new Error("Invalid JSON input for minification.");
            }
        },
        inputTypes: ["json"],
        outputType: "json",
    },

    prettyPrint: {
        label: "Pretty Print JSON",
        fn: (input: any) => {
            // Check if input is a stringified JSON, then parse it first
            try {
                // If it's a string, try to parse it as JSON
                if (typeof input === "string") {
                    input = JSON.parse(input);
                }
                // Now pretty-print the JSON object (stringify it with spaces for indentation)
                return JSON.stringify(input, null, 2);
            } catch (e) {
                throw new Error("Invalid JSON input for pretty-print.");
            }
        },
        inputTypes: ["json"],
        outputType: "json",
    },
};

// Function to detect the type of input

// Function to detect the type of input
export const detectType = (input: string): "json" | "yaml" | "base64" | "text" => {
    // Handle empty input first
    if (!input.trim()) {
        return "text"; // Empty input is considered as plain text.
    }

    // Check for base64 encoding: base64-encoded string should only contain certain characters and length multiple of 4
    const base64Pattern = /^[A-Za-z0-9+/=]*$/;
    const isBase64 = base64Pattern.test(input) && input.length % 4 === 0;

    if (isBase64) {
        try {
            // Try decoding base64
            atob(input);
            // Don't try to decode as JSON or YAML unless the decoded content is valid
            return "base64";
        } catch {
            // If decoding fails, consider it as plain text
            return "text";
        }
    }

    // First, check if it's valid JSON
    try {
        JSON.parse(input); // Attempt to parse JSON
        return "json"; // If it parses successfully, it's JSON
    } catch {}

    // Check if it's valid YAML only if JSON parsing fails
    try {
        yaml.load(input); // Attempt to parse YAML
        return "yaml"; // If it parses successfully, it's YAML
    } catch {}

    // If it's neither JSON nor YAML, treat it as plain text
    return "text";
};

export interface Step {
    id: string;
    transformation: keyof typeof transformations;
}
