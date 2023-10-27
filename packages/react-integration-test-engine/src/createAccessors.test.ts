import { type RenderResult, within } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { createAccessors, createAccessorsInternal } from "./createAccessors";
import { createAccessorsBase } from "./createAccessorsBase";
import { AccessorQueryType, type AccessorsType, QueriesType } from "./types";

vi.mock("@testing-library/react");

vi.mock("./createAccessors", async () => {
	const actual = (await vi.importActual("./createAccessors")) as {
		createAccessorsInternal: typeof createAccessorsInternal;
		createAccessors: typeof createAccessors;
	};

	return {
		createAccessorsInternal: vi.fn(actual.createAccessorsInternal),
		createAccessors: vi.fn(actual.createAccessors),
	};
});

vi.mock("./createAccessorsBase");

const accessors: AccessorsType = {
	find: vi.fn(),
	findAll: vi.fn(),
	get: vi.fn(),
	getAll: vi.fn(),
	query: vi.fn(),
	queryAll: vi.fn(),
};

const qs = {
	baseElement: document.createElement("article"),
	get: vi.fn(),
} as unknown as RenderResult;

const childCreateAccessors = vi.fn();

afterEach(() => {
	vi.mocked(createAccessors).mockRestore();
	vi.clearAllMocks();
});

describe("without mapper", () => {
	test("return original accessors", () => {
		const result = createAccessors(qs, {
			query: AccessorQueryType.AltText,
			parameters: ["test"],
		});

		expect(result).toBe(accessors);

		expect(createAccessorsBase).toHaveBeenCalledTimes(1);
		expect(vi.mocked(createAccessorsBase).mock.calls[0][2]).toEqual({
			query: AccessorQueryType.AltText,
			parameters: ["test"],
		});
	});
});

describe("with mapper", () => {
	const mappedElement = document.createElement("div");

	const mapper = vi.fn().mockReturnValue(mappedElement);

	vi.mocked(createAccessorsBase).mockReturnValue(accessors);

	const accessorsResult = createAccessors(qs, {
		query: AccessorQueryType.AltText,
		parameters: ["test"],
		mapper,
	});

	expect(createAccessorsBase).toHaveBeenCalledTimes(1);
	expect(vi.mocked(createAccessorsBase).mock.calls[0][2]).toEqual({
		query: AccessorQueryType.AltText,
		parameters: ["test"],
		mapper,
	});

	vi.mocked(createAccessorsBase).mockClear();

	test("find", async () => {
		const originalElement = document.createElement("span");
		vi.mocked(accessors.find).mockResolvedValue(originalElement);

		const result = await accessorsResult.find();

		expect(result).toBe(mappedElement);

		expect(accessors.find).toHaveBeenCalledTimes(1);

		expect(mapper).toHaveBeenCalledTimes(1);
		expect(mapper).toHaveBeenCalledWith(originalElement);
	});

	test("findAll", async () => {
		const originalElement1 = document.createElement("span");
		const originalElement2 = document.createElement("b");
		vi.mocked(accessors.findAll).mockResolvedValue([
			originalElement1,
			originalElement2,
		]);

		const mappedElement1 = document.createElement("p");
		const mappedElement2 = document.createElement("i");
		mapper
			.mockReturnValueOnce(mappedElement1)
			.mockReturnValueOnce(mappedElement2);

		const result = await accessorsResult.findAll();

		expect(result).toEqual([mappedElement1, mappedElement2]);

		expect(accessors.findAll).toHaveBeenCalledTimes(1);

		expect(mapper).toHaveBeenCalledTimes(2);
		expect(mapper.mock.calls[0][0]).toBe(originalElement1);
		expect(mapper.mock.calls[1][0]).toBe(originalElement2);
	});

	test("get", () => {
		const originalElement = document.createElement("span");
		vi.mocked(accessors.get).mockReturnValue(originalElement);

		const result = accessorsResult.get();

		expect(result).toBe(mappedElement);

		expect(accessors.get).toHaveBeenCalledTimes(1);

		expect(mapper).toHaveBeenCalledTimes(1);
		expect(mapper).toHaveBeenCalledWith(originalElement);
	});

	test("getAll", () => {
		const originalElement1 = document.createElement("span");
		const originalElement2 = document.createElement("b");
		vi.mocked(accessors.getAll).mockReturnValue([
			originalElement1,
			originalElement2,
		]);

		const mappedElement1 = document.createElement("p");
		const mappedElement2 = document.createElement("i");
		mapper
			.mockReturnValueOnce(mappedElement1)
			.mockReturnValueOnce(mappedElement2);

		const result = accessorsResult.getAll();

		expect(result).toEqual([mappedElement1, mappedElement2]);

		expect(accessors.getAll).toHaveBeenCalledTimes(1);

		expect(mapper).toHaveBeenCalledTimes(2);
		expect(mapper.mock.calls[0][0]).toBe(originalElement1);
		expect(mapper.mock.calls[1][0]).toBe(originalElement2);
	});

	test("query", () => {
		const originalElement = document.createElement("span");
		vi.mocked(accessors.query).mockReturnValue(originalElement);

		const result = accessorsResult.query();

		expect(result).toBe(mappedElement);

		expect(accessors.query).toHaveBeenCalledTimes(1);

		expect(mapper).toHaveBeenCalledTimes(1);
		expect(mapper).toHaveBeenCalledWith(originalElement);
	});

	test("query with no result", () => {
		vi.mocked(accessors.query).mockReturnValue(null);

		const result = accessorsResult.query();

		expect(result).toBe(null);

		expect(accessors.query).toHaveBeenCalledTimes(1);

		expect(mapper).toHaveBeenCalledTimes(0);
	});

	test("queryAll", () => {
		const originalElement1 = document.createElement("span");
		const originalElement2 = document.createElement("b");
		vi.mocked(accessors.queryAll).mockReturnValue([
			originalElement1,
			originalElement2,
		]);

		const mappedElement1 = document.createElement("p");
		const mappedElement2 = document.createElement("i");
		mapper
			.mockReturnValueOnce(mappedElement1)
			.mockReturnValueOnce(mappedElement2);

		const result = accessorsResult.queryAll();

		expect(result).toEqual([mappedElement1, mappedElement2]);

		expect(accessors.queryAll).toHaveBeenCalledTimes(1);

		expect(mapper).toHaveBeenCalledTimes(2);
		expect(mapper.mock.calls[0][0]).toBe(originalElement1);
		expect(mapper.mock.calls[1][0]).toBe(originalElement2);
	});
});

describe("getQs", () => {
	const getQs = () => vi.mocked(createAccessorsBase).mock.calls[0][0]();

	test("return original `qs` if `parent` is not provided", () => {
		createAccessorsInternal(childCreateAccessors, qs, {
			query: AccessorQueryType.AltText,
			parameters: ["test"],
		});

		expect(getQs()).toBe(qs);

		expect(childCreateAccessors).toHaveBeenCalledTimes(0);
	});

	test("return `qs` of parent", () => {
		const parentElement = document.createElement("main");

		const parentAccessors: AccessorsType = {
			find: vi.fn(),
			findAll: vi.fn(),
			get: vi.fn().mockReturnValue(parentElement),
			getAll: vi.fn(),
			query: vi.fn(),
			queryAll: vi.fn(),
		};

		createAccessorsInternal(childCreateAccessors, qs, {
			query: AccessorQueryType.AltText,
			parameters: ["test"],
			parent: {
				query: AccessorQueryType.Role,
				parameters: ["testRole"],
			},
		});

		const parentQs = {
			findAllByAltText: vi.fn(),
		} as unknown as QueriesType;

		vi.mocked(within).mockReturnValue(parentQs);

		vi.mocked(childCreateAccessors).mockReturnValue(parentAccessors);

		expect(getQs()).toBe(parentQs);

		expect(within).toHaveBeenCalledTimes(1);
		expect(within).toHaveBeenCalledWith(parentElement);

		expect(childCreateAccessors).toHaveBeenCalledTimes(1);
		expect(childCreateAccessors).toHaveBeenCalledWith(
			childCreateAccessors,
			qs,
			{
				query: AccessorQueryType.Role,
				parameters: ["testRole"],
			},
		);
	});
});

describe("getBaseElement", () => {
	const getBaseElement = () =>
		vi.mocked(createAccessorsBase).mock.calls[0][1]();

	test.todo(
		"return `baseElement` from original `qs` if `parent` is not provided",
		() => {
			createAccessorsInternal(childCreateAccessors, qs, {
				query: AccessorQueryType.AltText,
				parameters: ["test"],
			});

			expect(getBaseElement()).toBe(qs.baseElement);

			expect(childCreateAccessors).toHaveBeenCalledTimes(0);
		},
	);

	test("return `baseElement` from result of `get` of parent accessors", () => {
		const parentElement = document.createElement("main");

		const parentAccessors: AccessorsType = {
			find: vi.fn(),
			findAll: vi.fn(),
			get: vi.fn().mockReturnValue(parentElement),
			getAll: vi.fn(),
			query: vi.fn(),
			queryAll: vi.fn(),
		};

		createAccessorsInternal(childCreateAccessors, qs, {
			query: AccessorQueryType.AltText,
			parameters: ["test"],
			parent: {
				query: AccessorQueryType.Role,
				parameters: ["testRole"],
			},
		});

		vi.mocked(childCreateAccessors).mockReturnValue(parentAccessors);

		expect(getBaseElement()).toBe(parentElement);

		expect(childCreateAccessors).toHaveBeenCalledTimes(1);
		expect(childCreateAccessors).toHaveBeenCalledWith(
			childCreateAccessors,
			qs,
			{
				query: AccessorQueryType.Role,
				parameters: ["testRole"],
			},
		);
	});
});
