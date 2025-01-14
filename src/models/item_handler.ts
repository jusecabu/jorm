import {
	CollectionHandler,
	type Item,
} from '@src/models/collection_handler.ts';
import type { ItemAttributes, Prettify } from '@src/types/general.ts';
import { compareAttributes } from '@src/utils/functions.ts';

export class ItemHandler {
	static async get<T extends Item>(
		path: string,
		name: string,
		properties: ItemAttributes<T>,
	): Promise<Prettify<T>[]> {
		const collection = await CollectionHandler.find<T>(path, name);
		const items = collection.filter((item) =>
			compareAttributes(properties, item)
		);

		return items;
	}

	static async create<T extends Item>(
		path: string,
		name: string,
		item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>,
	): Promise<void> {
		const collection = await CollectionHandler.find(path, name);
		const _item = {
			...item,
			id: crypto.randomUUID(),
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		collection.push(_item);

		await CollectionHandler.save(path, name, collection);
	}

	static async update<T extends Item>(
		path: string,
		name: string,
		item: ItemAttributes<T>,
		values: ItemAttributes<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>,
	): Promise<void> {
		const collection = await CollectionHandler.find<T>(path, name);

		const updatedItems = collection.map((_item) => {
			if (compareAttributes(item, _item)) {
				return {
					..._item,
					...values,
					updatedAt: new Date(),
				};
			}

			return _item;
		});

		await CollectionHandler.save(path, name, updatedItems);
	}

	static async remove<T extends Item>(
		path: string,
		name: string,
		item: ItemAttributes<T>,
	): Promise<void> {
		const collection = await CollectionHandler.find<T>(path, name);

		const filteredCollection = collection.filter(
			(_item) => !compareAttributes(item, _item),
		);

		await CollectionHandler.save(path, name, filteredCollection);
	}
}
