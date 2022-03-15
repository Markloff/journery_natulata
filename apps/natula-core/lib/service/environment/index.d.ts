export interface IEnvironmentService {
    readonly _serviceBrand: undefined;
}
export declare class EnvironmentService implements IEnvironmentService {
    readonly projectRoot: string;
    readonly _serviceBrand: undefined;
    constructor(projectRoot: string);
    init(): void;
}
