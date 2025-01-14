import { ensureFile } from '@std/fs';
import { JSON_EXTENSION } from '@src/config/constants.ts';

export class FileHandler {
	static async #exists(path: string): Promise<boolean> {
		try {
			const stats = await Deno.stat(path);

			if (!stats.isFile) {
				throw new Error(
					`The specified path does not points to a file: ${path}`,
				);
			}

			const extension = path.split('.').at(-1) ?? '';

			if (extension !== JSON_EXTENSION) {
				throw new Error(
					`Invalid file extension: expected '${JSON_EXTENSION}', but received '${extension}'`,
				);
			}

			return true;
		} catch (error) {
			if (error instanceof Deno.errors.NotFound) {
				return false;
			}

			throw error;
		}
	}

	static async #check(path: string): Promise<void> {
		const exists = await this.#exists(path);

		if (!exists) {
			throw new Error(`The file does not exist at path: ${path}`);
		}
	}

	static async ensure(path: string): Promise<void> {
		const fileExist = await this.#exists(path);

		if (!fileExist) {
			await ensureFile(path);
			await Deno.writeTextFile(path, '{}');
		}
	}

	static async read(path: string): Promise<string> {
		await this.#check(path);

		const contents = await Deno.readTextFile(path);

		return contents;
	}

	static async write(path: string, contents: string): Promise<void> {
		await this.#check(path);

		await Deno.writeTextFile(path, contents);
	}
}
