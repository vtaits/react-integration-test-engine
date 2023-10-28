import { type RenderResult, within } from "@testing-library/react";
import { createAccessorsBase } from "./createAccessorsBase";
import type { AccessorParamsType, AccessorsType, QueriesType } from "./types";

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

	const queryQs = <Required extends boolean>(
		required: Required,
	): Required extends true ? QueriesType : QueriesType | null => {
		if (parent) {
			const parentAccessors = self(self, qs, parent);

			const parentElement = required
				? parentAccessors.get()
				: parentAccessors.query();

			if (!parentElement) {
				return null as Required extends true ? QueriesType : QueriesType | null;
			}

			const parentQs = within(parentElement);

			return parentQs;
		}

		return qs;
	};

	const queryBaseElement = <Required extends boolean>(
		required: Required,
	): Required extends true ? HTMLElement : HTMLElement | null => {
		if (parent) {
			const parentAccessors = self(self, qs, parent);

			const parentElement = required
				? parentAccessors.get()
				: parentAccessors.query();

			return parentElement as Required extends true
				? HTMLElement
				: HTMLElement | null;
		}

		return qs.baseElement;
	};

	const baseResult = createAccessorsBase(queryQs, queryBaseElement, params);

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
