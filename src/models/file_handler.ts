import { ensureFile } from '@std/fs';
import {
	FileNotFound,
	InvalidFileExtension,
	InvalidPath,
} from '@src/models/errors/index.ts';

const JSON_EXTENSION = 'json' as const;

export class FileHandler {
	static async #exists(path: string): Promise<boolean> {
		const extension = path.split('.').at(-1) ?? '';

		try {
			const stats = await Deno.stat(path);

			if (!stats.isFile) {
				throw new InvalidPath(path);
			}

			if (extension !== JSON_EXTENSION) {
				throw new InvalidFileExtension(JSON_EXTENSION, extension);
			}

			return true;
		} catch (error) {
			if (error instanceof Deno.errors.NotFound) {
				return false;
			}

			throw error;
		}
	}

	static async ensure(path: string): Promise<void> {
		const fileExist = await this.#exists(path);

		if (!fileExist) {
			await ensureFile(path);
		}
	}

	static async read(path: string): Promise<string> {
		const exists = await this.#exists(path);

		if (!exists) throw new FileNotFound(path);

		const contents = await Deno.readTextFile(path);

		return contents;
	}

	static async write(path: string, contents: string): Promise<void> {
		const exists = await this.#exists(path);

		if (!exists) throw new FileNotFound(path);

		await Deno.writeTextFile(path, contents);
	}
}
