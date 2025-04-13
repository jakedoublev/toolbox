export type Transformation =
    | { type: "decodeBase64" }
    | { type: "parseJson" }
    | { type: "parseYaml" }
    | { type: "convertToJson" }
    | { type: "convertToYaml" }
    | { type: "encodeBase64" };

export type ValueType = "json" | "yaml" | "base64" | "string" | "unknown";

export interface TransformationDefinition {
    label: string;
    from: ValueType[];
    to: ValueType;
    apply: (input: any) => any;
}
