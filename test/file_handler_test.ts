import { assert, assertEquals } from '@std/assert';
import { FileHandler } from '@src/models/file_handler.ts';
import { exists } from '@std/fs';

Deno.test('test file handler methods', async (t) => {
	const data = JSON.stringify({ test: 'data' });
	const path = './test/data.json';

	await FileHandler.ensure(path);

	await t.step('ensure file is created', async () => {
		const fileExist = await exists(path, { isFile: true });

		assert(fileExist);
	});

	await t.step('ensure data is saved correctly to the file', async () => {
		await FileHandler.write(path, data);

		const fileData = await FileHandler.read(path);

		assertEquals(fileData, data);
	});

	await t.step('ensure data is read correctly from the file', async () => {
		const fileData = await FileHandler.read(path);

		assertEquals(fileData, data);
	});

	await Deno.remove(path);
});
