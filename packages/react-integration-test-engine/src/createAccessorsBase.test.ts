import { waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { createAccessorsBase } from "./createAccessorsBase";
import { type AccessorParamsType, AccessorQueryType } from "./types";

vi.mock("@testing-library/react");
const mockedWaitFor = vi.mocked(waitFor);

const querySelectorAll = vi.fn();

const qs = {
	getByRole: vi.fn(),
	getAllByRole: vi.fn(),
	queryAllByRole: vi.fn(),
	queryByRole: vi.fn(),
	findAllByRole: vi.fn(),
	findByRole: vi.fn(),
	getAllByLabelText: vi.fn(),
	getByLabelText: vi.fn(),
	queryAllByLabelText: vi.fn(),
	queryByLabelText: vi.fn(),
	findAllByLabelText: vi.fn(),
	findByLabelText: vi.fn(),
	getAllByPlaceholderText: vi.fn(),
	getByPlaceholderText: vi.fn(),
	queryAllByPlaceholderText: vi.fn(),
	queryByPlaceholderText: vi.fn(),
	findAllByPlaceholderText: vi.fn(),
	findByPlaceholderText: vi.fn(),
	getAllByText: vi.fn(),
	getByText: vi.fn(),
	queryAllByText: vi.fn(),
	queryByText: vi.fn(),
	findAllByText: vi.fn(),
	findByText: vi.fn(),
	getAllByDisplayValue: vi.fn(),
	getByDisplayValue: vi.fn(),
	queryAllByDisplayValue: vi.fn(),
	queryByDisplayValue: vi.fn(),
	findAllByDisplayValue: vi.fn(),
	findByDisplayValue: vi.fn(),
	getAllByAltText: vi.fn(),
	getByAltText: vi.fn(),
	queryAllByAltText: vi.fn(),
	queryByAltText: vi.fn(),
	findAllByAltText: vi.fn(),
	findByAltText: vi.fn(),
	getAllByTitle: vi.fn(),
	getByTitle: vi.fn(),
	queryAllByTitle: vi.fn(),
	queryByTitle: vi.fn(),
	findAllByTitle: vi.fn(),
	findByTitle: vi.fn(),
	getAllByTestId: vi.fn(),
	getByTestId: vi.fn(),
	queryAllByTestId: vi.fn(),
	queryByTestId: vi.fn(),
	findAllByTestId: vi.fn(),
	findByTestId: vi.fn(),
};

const getQs = vi.fn().mockReturnValue(qs);

const getBaseElement = vi.fn();

beforeEach(() => {
	Object.entries(qs).forEach(([key, mock]) => {
		if (typeof mock === "function") {
			mock.mockReturnValue(`${key} return`);
		}
	});
});

beforeEach(() => {
	getQs.mockReturnValue(qs);
	getBaseElement.mockReturnValue({
		querySelectorAll,
	} as unknown as HTMLElement);
});

afterEach(() => {
	vi.resetAllMocks();
});

describe.each([
	["Role", AccessorQueryType.Role],
	["LabelText", AccessorQueryType.LabelText],
	["PlaceholderText", AccessorQueryType.PlaceholderText],
	["Text", AccessorQueryType.Text],
	["DisplayValue", AccessorQueryType.DisplayValue],
	["AltText", AccessorQueryType.AltText],
	["Title", AccessorQueryType.Title],
	["TestId", AccessorQueryType.TestId],
])("query type = %s", (queryName, queryType) => {
	const accessors = createAccessorsBase(getQs, getBaseElement, {
		query: queryType,
		parameters: [
			"arg1",
			{
				checked: true,
				pressed: false,
			},
		],
	} as unknown as AccessorParamsType);

	test.each([
		["getAll"],
		["get"],
		["queryAll"],
		["query"],
		["findAll"],
		["find"],
	] as const)("accessor key = %s", (accessorKey) => {
		expect(getQs).toHaveBeenCalledTimes(0);

		const accessor = accessors[accessorKey];

		const functionName = `${accessorKey}By${queryName}`;

		expect(accessor()).toBe(`${functionName} return`);

		expect(getQs).toHaveBeenCalledTimes(1);
		Object.entries(qs).forEach(([key, mock]) => {
			if (key === functionName) {
				expect(mock).toHaveBeenCalledTimes(1);
				expect(mock).toHaveBeenCalledWith("arg1", {
					checked: true,
					pressed: false,
				});
			} else {
				expect(mock).toHaveBeenCalledTimes(0);
			}
		});
	});
});

describe("QuerySelector", () => {
	const selector = "div > span";

	const accessors = createAccessorsBase(getQs, getBaseElement, {
		query: AccessorQueryType.QuerySelector,
		parameters: [selector],
	});

	describe("get", () => {
		test("call `querySelectorAll` with correct parameters", () => {
			expect(getBaseElement).toHaveBeenCalledTimes(0);
			querySelectorAll.mockReturnValue([document.createElement("div")]);

			accessors.get();

			expect(querySelectorAll).toHaveBeenCalledTimes(1);
			expect(querySelectorAll).toHaveBeenCalledWith(selector);
		});

		test("throw an error if there are no mathed elements", () => {
			querySelectorAll.mockReturnValue([]);

			expect(() => {
				accessors.get();
			}).toThrow();
		});

		test("throw an error if there are more that one mathed elements", () => {
			querySelectorAll.mockReturnValue([
				document.createElement("div"),
				document.createElement("span"),
			]);

			expect(() => {
				accessors.get();
			}).toThrow();
		});

		test("return matched element", () => {
			const result = document.createElement("div");

			querySelectorAll.mockReturnValue([result]);

			expect(accessors.get()).toBe(result);
		});
	});

	describe("getAll", () => {
		test("call `querySelectorAll` with correct parameters", () => {
			expect(getBaseElement).toHaveBeenCalledTimes(0);
			querySelectorAll.mockReturnValue([document.createElement("div")]);

			accessors.getAll();

			expect(querySelectorAll).toHaveBeenCalledTimes(1);
			expect(querySelectorAll).toHaveBeenCalledWith(selector);
		});

		test("throw an error if there are no mathed elements", () => {
			querySelectorAll.mockReturnValue([]);

			expect(() => {
				accessors.getAll();
			}).toThrow();
		});

		test("return matched elements", () => {
			const result = [
				document.createElement("div"),
				document.createElement("span"),
			];

			querySelectorAll.mockReturnValue(result);

			expect(accessors.getAll()).toEqual(result);
		});
	});

	describe("query", () => {
		test("call `querySelectorAll` with correct parameters", () => {
			expect(getBaseElement).toHaveBeenCalledTimes(0);
			querySelectorAll.mockReturnValue([document.createElement("div")]);

			accessors.query();

			expect(querySelectorAll).toHaveBeenCalledTimes(1);
			expect(querySelectorAll).toHaveBeenCalledWith(selector);
		});

		test("throw an error if there are more that one mathed elements", () => {
			querySelectorAll.mockReturnValue([
				document.createElement("div"),
				document.createElement("span"),
			]);

			expect(() => {
				accessors.query();
			}).toThrow();
		});

		test("return `null` if there are no mathed elements", () => {
			querySelectorAll.mockReturnValue([]);

			expect(accessors.query()).toBe(null);
		});

		test("return matched element", () => {
			const result = document.createElement("div");

			querySelectorAll.mockReturnValue([result]);

			expect(accessors.query()).toBe(result);
		});
	});

	describe("queryAll", () => {
		test("call `querySelectorAll` with correct parameters", () => {
			expect(getBaseElement).toHaveBeenCalledTimes(0);
			querySelectorAll.mockReturnValue([document.createElement("div")]);

			accessors.queryAll();

			expect(querySelectorAll).toHaveBeenCalledTimes(1);
			expect(querySelectorAll).toHaveBeenCalledWith(selector);
		});

		test("return an empty array if there are no mathed elements", () => {
			querySelectorAll.mockReturnValue([]);

			expect(accessors.queryAll()).toEqual([]);
		});

		test("return matched elements", () => {
			const result = [
				document.createElement("div"),
				document.createElement("span"),
			];

			querySelectorAll.mockReturnValue(result);

			expect(accessors.queryAll()).toEqual(result);
		});
	});

	describe("find", () => {
		test("call `waitFor` without parameters", async () => {
			expect(getBaseElement).toHaveBeenCalledTimes(0);
			await accessors.find();

			expect(mockedWaitFor.mock.calls[0][1]).toBeFalsy();
		});

		test("call `waitFor` with parameters", async () => {
			const waitForElementOptions = {
				interval: 10,
				timeout: 20,
			};

			await createAccessorsBase(getQs, getBaseElement, {
				query: AccessorQueryType.QuerySelector,
				parameters: [
					selector,
					{
						waitForElementOptions,
					},
				],
			}).find();

			expect(mockedWaitFor.mock.calls[0][1]).toBe(waitForElementOptions);
		});

		test("return result of `waitFor`", async () => {
			const result = document.createElement("div");

			mockedWaitFor.mockResolvedValue(result);

			const accessorResult = await accessors.find();

			expect(accessorResult).toBe(result);
		});

		test("call `querySelectorAll` with correct parameters", async () => {
			const result = document.createElement("div");

			mockedWaitFor.mockResolvedValue(result);

			querySelectorAll.mockReturnValue([document.createElement("div")]);

			await accessors.find();

			mockedWaitFor.mock.calls[0][0]();

			expect(querySelectorAll).toHaveBeenCalledTimes(1);
			expect(querySelectorAll).toHaveBeenCalledWith(selector);
		});

		test("throw an error if there are no mathed elements", async () => {
			querySelectorAll.mockReturnValue([]);

			await accessors.find();

			expect(() => {
				mockedWaitFor.mock.calls[0][0]();
			}).toThrow();
		});

		test("throw an error if there are more that one mathed elements", async () => {
			querySelectorAll.mockReturnValue([
				document.createElement("div"),
				document.createElement("span"),
			]);

			await accessors.find();

			expect(() => {
				mockedWaitFor.mock.calls[0][0]();
			}).toThrow();
		});

		test("return matched element", async () => {
			const result = document.createElement("div");

			querySelectorAll.mockReturnValue([result]);

			await accessors.find();

			expect(mockedWaitFor.mock.calls[0][0]()).toBe(result);
		});
	});

	describe("findAll", () => {
		test("call `waitFor` without parameters", async () => {
			expect(getBaseElement).toHaveBeenCalledTimes(0);
			await accessors.findAll();

			expect(mockedWaitFor.mock.calls[0][1]).toBeFalsy();
		});

		test("call `waitFor` with parameters", async () => {
			const waitForElementOptions = {
				interval: 10,
				timeout: 20,
			};

			await createAccessorsBase(getQs, getBaseElement, {
				query: AccessorQueryType.QuerySelector,
				parameters: [
					selector,
					{
						waitForElementOptions,
					},
				],
			}).findAll();

			expect(mockedWaitFor.mock.calls[0][1]).toBe(waitForElementOptions);
		});

		test("return result of `waitFor`", async () => {
			const result = [
				document.createElement("div"),
				document.createElement("span"),
			];

			mockedWaitFor.mockResolvedValue(result);

			const accessorResult = await accessors.findAll();

			expect(accessorResult).toBe(result);
		});

		test("call `querySelectorAll` with correct parameters", async () => {
			const result = document.createElement("div");

			mockedWaitFor.mockResolvedValue(result);

			querySelectorAll.mockReturnValue([document.createElement("div")]);

			await accessors.findAll();

			mockedWaitFor.mock.calls[0][0]();

			expect(querySelectorAll).toHaveBeenCalledTimes(1);
			expect(querySelectorAll).toHaveBeenCalledWith(selector);
		});

		test("throw an error if there are no mathed elements", async () => {
			querySelectorAll.mockReturnValue([]);

			await accessors.findAll();

			expect(() => {
				mockedWaitFor.mock.calls[0][0]();
			}).toThrow();
		});

		test("return matched element", async () => {
			const result = [
				document.createElement("div"),
				document.createElement("span"),
			];

			querySelectorAll.mockReturnValue(result);

			await accessors.findAll();

			expect(mockedWaitFor.mock.calls[0][0]()).toEqual(result);
		});
	});
});

test("throw an error for unknown query", () => {
	expect(() => {
		createAccessorsBase(getQs, getBaseElement, {
			query: null,
			parameters: [
				"arg1",
				{
					checked: true,
					pressed: false,
				},
			],
		} as unknown as AccessorParamsType);
	}).toThrow();
});
