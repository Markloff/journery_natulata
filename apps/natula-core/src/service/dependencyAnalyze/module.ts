



export interface IModule {
}

export class Module implements IModule {
	readonly id: string;
	readonly external: boolean;

	constructor(id: string, external: boolean) {
		this.id = id;
		this.external = external;
	}
}
