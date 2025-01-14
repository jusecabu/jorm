import { FileHandler } from '@src/models/file_handler.ts';
import { convertStringToDate } from '@src/utils/functions.ts';

export type Item = {
	id: `${string}-${string}-${string}-${string}-${string}`;
	createdAt: Date;
	updatedAt: Date;
	// deno-lint-ignore no-explicit-any
	[k: string]: any;
};

export class CollectionHandler {
	static async #exists(path: string, name: string): Promise<boolean> {
		const contents = await FileHandler.read(path);
		const collectionExists = contents.includes(name);

		if (!collectionExists) return false;

		const fileData = JSON.parse(contents);
		const collection = fileData[name];

		if (!Array.isArray(collection)) return false;

		return true;
	}

	static async #check(path: string, name: string): Promise<void> {
		const collectionExists = await this.#exists(path, name);

		if (!collectionExists) {
			const file = path.split('/').at(-1);

			throw new Error(
				`The collection ${name} does not exist in the file: ${file}`,
			);
		}
	}

	static async ensure(path: string, name: string): Promise<void> {
		const collectionExists = await this.#exists(path, name);

		if (!collectionExists) {
			let contents = await FileHandler.read(path);
			const data = JSON.parse(contents);
			data[name] = [];
			contents = JSON.stringify(data);

			await FileHandler.write(path, contents);
		}
	}

	static async find<T extends Item>(
		path: string,
		name: string,
	): Promise<T[]> {
		await this.#check(path, name);

		const contents = await FileHandler.read(path);
		const fileData = JSON.parse(contents);
		const _collection = fileData[name];
		// deno-lint-ignore no-explicit-any
		const collection = _collection.map((_item: any) =>
			convertStringToDate(_item)
		);

		return collection;
	}

	static async save<T extends Item>(
		path: string,
		name: string,
		data: T[],
	): Promise<void> {
		await this.#check(path, name);

		let contents = await FileHandler.read(path);
		const fileData = JSON.parse(contents);
		fileData[name] = data;
		contents = JSON.stringify(fileData);

		await FileHandler.write(path, contents);
	}
}
