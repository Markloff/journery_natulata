type MonorepoType = 'rush' | 'turbo';
export interface InitializeOptions {
    name: string;
    monorepo: MonorepoType | null;
}
export interface IWorkspace {
}
export {};
