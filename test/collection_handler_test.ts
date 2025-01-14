import { assert, assertEquals } from '@std/assert';
import { FileHandler } from '@src/models/file_handler.ts';
import {
	CollectionHandler,
	type Item,
} from '@src/models/collection_handler.ts';

Deno.test('collection handler methods', async (t) => {
	const name = 'test';
	const data: Item[] = [
		{
			id: '1',
			createdAt: new Date(),
			updatedAt: new Date(),
			test: 'a',
		},
		{
			id: '2',
			createdAt: new Date(),
			updatedAt: new Date(),
			test: 'b',
		},
		{
			id: '3',
			createdAt: new Date(),
			updatedAt: new Date(),
			test: 'c',
		},
	];
	const path = './test/data.json';

	await FileHandler.ensure(path);

	await t.step('ensure collection is created', async () => {
		await CollectionHandler.ensure(path, name);

		const contents = await FileHandler.read(path);
		const collectionExists = contents.includes(name);

		assert(collectionExists);
	});

	await t.step('ensure a collection is saved correctly', async () => {
		await CollectionHandler.save(path, name, data);

		const contents = await FileHandler.read(path);
		const fileData = JSON.parse(contents);
		const collection = JSON.stringify(fileData[name]);
		const _data = JSON.stringify(data);

		assertEquals(collection, _data);
	});

	await t.step('ensure collection is read correctly', async () => {
		const collection = await CollectionHandler.find(path, name);
		const _collection = JSON.stringify(collection);
		const _data = JSON.stringify(data);

		assertEquals(_collection, _data);
	});

	await Deno.remove(path);
});
