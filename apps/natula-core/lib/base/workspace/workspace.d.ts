export type MonorepoType = 'rush' | 'turbo';
export type Bundler = 'webpack' | 'vite';
export interface InitializeOptions {
    name: string;
    rootPath: string;
    monorepo: MonorepoType | null;
    graphQL: string;
    microFrontendClient: string;
    appHomeDir: string;
}
export interface IWorkspace {
    _serviceBrand: undefined;
    init(): Promise<void>;
}
