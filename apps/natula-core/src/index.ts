import { createService } from './service';
import { getDefaultProjectName, ProjectType } from './base/project/project';

const application = createService();

export {
	application,
	getDefaultProjectName,
	ProjectType
}
