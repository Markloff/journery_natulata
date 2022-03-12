import { createService } from './service';


const service = createService();

export const build = (entry: string) => {
	service.executeCommand('build.single-entry', entry);
}

