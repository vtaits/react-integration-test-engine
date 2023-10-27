import { type RenderResult, within } from "@testing-library/react";
import { createAccessorsBase } from "./createAccessorsBase";
import type { AccessorParamsType, AccessorsType } from "./types";

type CreateAccessorsInternal = (
	self: CreateAccessorsInternal,
	qs: RenderResult,
	params: AccessorParamsType,
) => AccessorsType;

/**
 * Provide self as first argument for testing
 */
export function createAccessorsInternal(
	self: CreateAccessorsInternal,
	qs: RenderResult,
	params: AccessorParamsType,
): AccessorsType {
	const { mapper, parent } = params;

	const getQs = () => {
		if (parent) {
			const parentAccessors = self(self, qs, parent);

			const parentElement = parentAccessors.get();

			const parentQs = within(parentElement);

			return parentQs;
		}

		return qs;
	};

	const getBaseElement = () => {
		if (parent) {
			const parentAccessors = self(self, qs, parent);

			const parentElement = parentAccessors.get();

			return parentElement;
		}

		return qs.baseElement;
	};

	const baseResult = createAccessorsBase(getQs, getBaseElement, params);

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

export function createAccessors(
	qs: RenderResult,
	params: AccessorParamsType,
): AccessorsType {
	return createAccessorsInternal(createAccessorsInternal, qs, params);
}
