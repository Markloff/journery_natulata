import * as fs from 'fs';
import { join } from 'path';

const CONTENT_ROOT = join(process.cwd(), "contents")

export interface MdxFile {
	content: string;
	path: string;
}

export const getAllMdxContents = (): MdxFile[] => {
	const filePaths = fs.readdirSync(CONTENT_ROOT);
	return filePaths.map((path) => {
		const absolutePath = join(CONTENT_ROOT, path);
		const content = fs.readFileSync(absolutePath, "utf8");
		return {
			content,
			path: absolutePath
		}
	})
}
