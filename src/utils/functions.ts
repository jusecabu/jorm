import { DATE_REGEX } from '@src/config/constants.ts';

// deno-lint-ignore no-explicit-any
export function convertStringToDate(obj: any): any {
	obj = structuredClone(obj);

	// deno-lint-ignore no-explicit-any
	function convert(obj: any): any {
		for (const key in obj) {
			const value = obj[key];

			if (typeof value === 'string' && DATE_REGEX.test(value)) {
				obj[key] = new Date(value);
			} else if (typeof value === 'object' && value !== null) {
				convert(value);
			}
		}
		return obj;
	}

	return convert(obj);
}

// deno-lint-ignore no-explicit-any
export function compareAttributes(obj1: any, obj2: any): boolean {
	const commonKeys = Object.keys(obj1).filter((key) => key in obj2);

	for (const key of commonKeys) {
		const val1 = obj1[key];
		const val2 = obj2[key];

		if (
			typeof val1 === 'object' && val1 !== null &&
			typeof val2 === 'object' && val2 !== null
		) {
			if (JSON.stringify(val1) !== JSON.stringify(val2)) return false;
		} else {
			if (val1 !== val2) return false;
		}
	}

	return true;
}
