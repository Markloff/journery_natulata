


export interface IEnvironmentService {
	readonly _serviceBrand: undefined;
}


export class EnvironmentService implements IEnvironmentService {
	readonly _serviceBrand: undefined;

	constructor(
		readonly projectRoot: string,
	) {

	}

	public init() {
	}

}

