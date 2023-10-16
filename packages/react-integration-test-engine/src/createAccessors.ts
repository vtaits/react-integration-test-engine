import type { RenderResult } from "@testing-library/react";
import { createAccessorsBase } from "./createAccessorsBase";
import type { AccessorParamsType, AccessorsType } from "./types";

export function createAccessors(
	qs: RenderResult,
	params: AccessorParamsType,
): AccessorsType {
	const baseResult = createAccessorsBase(qs, params);

	const { mapper } = params;

	if (!mapper) {
		return baseResult;
	}

	const { find, findAll, get, getAll, query, queryAll } = baseResult;

	return {
		find: async (...args) => {
			const result = await find(...args);

			return mapper(result);
		},
		findAll: async (...args) => {
			const result = await findAll(...args);

			return result.map(mapper);
		},
		get: (...args) => {
			const result = get(...args);

			return mapper(result);
		},
		getAll: (...args) => {
			const result = getAll(...args);

			return result.map(mapper);
		},
		query: (...args) => {
			const result = query(...args);

			if (!result) {
				return null;
			}

			return mapper(result);
		},
		queryAll: (...args) => {
			const result = queryAll(...args);

			return result.map(mapper);
		},
	};
}
