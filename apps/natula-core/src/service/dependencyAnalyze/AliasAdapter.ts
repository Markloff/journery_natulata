

export interface IAliasService {

	readonly _serviceBrand: undefined;
	check(path: string): boolean;
	transfer(path: string): string;
}


export class AliasService implements IAliasService {
	readonly _serviceBrand: undefined;

	private readonly _aliasMap: Map<string, string>;

	constructor() {
		this._aliasMap = new Map<string, string>();
	}

	check(path: string): boolean {
		throw new Error('not implement')
	}

	transfer(path: string): string {

	}
}
