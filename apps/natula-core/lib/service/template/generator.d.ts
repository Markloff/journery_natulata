interface Options {
    locals?: Record<string, any>;
    helpers?: any;
}
export declare class HygenGenerator {
    private readonly templates;
    constructor(templates: string);
    execute(argv: string[], options?: Options): Promise<void>;
}
export {};
