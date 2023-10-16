import type { RenderResult } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { createAccessors } from "./createAccessors";
import { createAccessorsBase } from "./createAccessorsBase";
import { AccessorQueryType, type AccessorsType } from "./types";

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
	get: vi.fn(),
} as unknown as RenderResult;

afterEach(() => {
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
		expect(createAccessorsBase).toHaveBeenCalledWith(qs, {
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
	expect(createAccessorsBase).toHaveBeenCalledWith(qs, {
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
