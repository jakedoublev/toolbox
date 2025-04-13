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
        fn: (input: any) => btoa(typeof input === "string" ? input : JSON.stringify(input)),
        inputTypes: ["json", "text", "yaml"],
        outputType: "base64",
    },
    decodeBase64: {
        label: "Decode Base64",
        fn: (input: any) => atob(input),
        inputTypes: ["base64"],
        outputType: "text",
    },
    convertToYAML: {
        label: "Convert to YAML",
        fn: (input: any) => yaml.dump(input),
        inputTypes: ["json"],
        outputType: "yaml",
    },
    convertToJSON: {
        label: "Convert to JSON",
        fn: (input: any) => yaml.load(input),
        inputTypes: ["yaml"],
        outputType: "json",
    },
    minify: {
        label: "Minify JSON",
        fn: (input: any) => JSON.stringify(input),
        inputTypes: ["json"],
        outputType: "json",
    },
    prettyPrint: {
        label: "Pretty Print JSON",
        fn: (input: any) => JSON.stringify(input, null, 2),
        inputTypes: ["json"],
        outputType: "json",
    },
};

export const detectType = (input: string): DataType => {
    try {
        JSON.parse(input);
        return "json";
    } catch {}
    try {
        yaml.load(input);
        return "yaml";
    } catch {}
    if (/^[A-Za-z0-9+/=\n\r]+$/.test(input)) {
        try {
            atob(input);
            return "base64";
        } catch {}
    }
    return "text";
};

export interface Step {
    id: string;
    transformation: keyof typeof transformations;
}
