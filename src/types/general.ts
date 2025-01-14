export type Prettify<T> =
	& {
		[K in keyof T]: T[K];
	}
	// deno-lint-ignore ban-types
	& {};

export type ItemAttributes<T> = {
	[K in keyof T]?: T[K];
};
