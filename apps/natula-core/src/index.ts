import { createService } from './service';


const service = createService();

export const build = (entry: string) => {
	console.log('entry', entry, service);
}

