import { FileHandler } from '@src/models/file_handler.ts';
import { CollectionHandler } from '@src/models/collection_handler.ts';

export class JORM {
	#path: string;

	constructor(path: string) {
		this.#path = path;
	}

	async collection(name: string) {
		const path = this.#path;

		await FileHandler.ensure(path);
		await CollectionHandler.ensure(path, name);
	}
}
