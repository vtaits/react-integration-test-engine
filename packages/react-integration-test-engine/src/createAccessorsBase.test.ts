import { waitFor } from "@testing-library/dom";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { createAccessorsBase } from "./createAccessorsBase";
import { type AccessorParamsType, AccessorQueryType } from "./types";

vi.mock("@testing-library/dom");
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

const queryQs = vi.fn().mockReturnValue(qs);

const queryBaseElement = vi.fn();

beforeEach(() => {
	for (const [key, mock] of Object.entries(qs)) {
		if (typeof mock === "function") {
			mock.mockReturnValue(`${key} return`);
		}
	}
});

beforeEach(() => {
	queryQs.mockReturnValue(qs);
	queryBaseElement.mockReturnValue({
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
	const accessors = createAccessorsBase(queryQs, queryBaseElement, {
		query: queryType,
		parameters: [
			"arg1",
			{
				checked: true,
				pressed: false,
			},
		],
	} as unknown as AccessorParamsType);

	test.each([["getAll"], ["get"]] as const)(
		"accessor key = %s",
		(accessorKey) => {
			expect(queryQs).toHaveBeenCalledTimes(0);

			const accessor = accessors[accessorKey];

			const functionName = `${accessorKey}By${queryName}`;

			expect(accessor()).toBe(`${functionName} return`);

			expect(queryQs).toHaveBeenCalledTimes(1);
			expect(queryQs).toHaveBeenCalledWith(true);

			for (const [key, mock] of Object.entries(qs)) {
				if (key === functionName) {
					expect(mock).toHaveBeenCalledTimes(1);
					expect(mock).toHaveBeenCalledWith("arg1", {
						checked: true,
						pressed: false,
					});
				} else {
					expect(mock).toHaveBeenCalledTimes(0);
				}
			}
		},
	);

	describe.each([
		["queryAll", []],
		["query", null],
	] as const)("accessor key = %s", (accessorKey, emptyValue) => {
		test("return empty value if `qs` is not found", () => {
			expect(queryQs).toHaveBeenCalledTimes(0);

			queryQs.mockReturnValueOnce(null);

			const accessor = accessors[accessorKey];

			expect(accessor()).toEqual(emptyValue);

			expect(queryQs).toHaveBeenCalledTimes(1);
			expect(queryQs).toHaveBeenCalledWith(false);

			for (const [, mock] of Object.entries(qs)) {
				expect(mock).toHaveBeenCalledTimes(0);
			}
		});

		test("return result of corresponding function", () => {
			expect(queryQs).toHaveBeenCalledTimes(0);

			const accessor = accessors[accessorKey];

			const functionName = `${accessorKey}By${queryName}`;

			expect(accessor()).toBe(`${functionName} return`);

			expect(queryQs).toHaveBeenCalledTimes(1);
			expect(queryQs).toHaveBeenCalledWith(false);

			for (const [key, mock] of Object.entries(qs)) {
				if (key === functionName) {
					expect(mock).toHaveBeenCalledTimes(1);
					expect(mock).toHaveBeenCalledWith("arg1", {
						checked: true,
						pressed: false,
					});
				} else {
					expect(mock).toHaveBeenCalledTimes(0);
				}
			}
		});
	});

	test.each([["findAll"], ["find"]] as const)(
		"accessor key = %s",
		async (accessorKey) => {
			vi.mocked(waitFor).mockResolvedValue(qs);
			expect(queryQs).toHaveBeenCalledTimes(0);

			const accessor = accessors[accessorKey];

			const functionName = `${accessorKey}By${queryName}`;

			const accessorResult = await accessor();

			expect(accessorResult).toBe(`${functionName} return`);

			expect(waitFor).toHaveBeenCalledTimes(1);

			for (const [key, mock] of Object.entries(qs)) {
				if (key === functionName) {
					expect(mock).toHaveBeenCalledTimes(1);
					expect(mock).toHaveBeenCalledWith("arg1", {
						checked: true,
						pressed: false,
					});
				} else {
					expect(mock).toHaveBeenCalledTimes(0);
				}
			}

			expect(queryQs).toHaveBeenCalledTimes(0);

			const qsResult = vi.mocked(waitFor).mock.calls[0][0]();

			expect(qsResult).toBe(qs);

			expect(queryQs).toHaveBeenCalledTimes(1);
			expect(queryQs).toHaveBeenCalledWith(true);
		},
	);
});

describe("QuerySelector", () => {
	const selector = "div > span";

	const accessors = createAccessorsBase(queryQs, queryBaseElement, {
		query: AccessorQueryType.QuerySelector,
		parameters: [selector],
	});

	describe("get", () => {
		test("call `querySelectorAll` with correct parameters", () => {
			expect(queryBaseElement).toHaveBeenCalledTimes(0);
			querySelectorAll.mockReturnValue([document.createElement("div")]);

			accessors.get();

			expect(queryBaseElement).toHaveBeenCalledTimes(1);
			expect(queryBaseElement).toHaveBeenCalledWith(true);

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
			expect(queryBaseElement).toHaveBeenCalledTimes(0);
			querySelectorAll.mockReturnValue([document.createElement("div")]);

			accessors.getAll();

			expect(queryBaseElement).toHaveBeenCalledTimes(1);
			expect(queryBaseElement).toHaveBeenCalledWith(true);

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
			expect(queryBaseElement).toHaveBeenCalledTimes(0);
			querySelectorAll.mockReturnValue([document.createElement("div")]);

			accessors.query();

			expect(queryBaseElement).toHaveBeenCalledTimes(1);
			expect(queryBaseElement).toHaveBeenCalledWith(false);

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

		test("return `null` if base element is not found", () => {
			queryBaseElement.mockReturnValueOnce(null);

			expect(accessors.query()).toBe(null);

			expect(querySelectorAll).toHaveBeenCalledTimes(0);
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
			expect(queryBaseElement).toHaveBeenCalledTimes(0);
			querySelectorAll.mockReturnValue([document.createElement("div")]);

			accessors.queryAll();

			expect(queryBaseElement).toHaveBeenCalledTimes(1);
			expect(queryBaseElement).toHaveBeenCalledWith(false);

			expect(querySelectorAll).toHaveBeenCalledTimes(1);
			expect(querySelectorAll).toHaveBeenCalledWith(selector);
		});

		test("return an empty array if base element is not found", () => {
			queryBaseElement.mockReturnValueOnce(null);

			expect(accessors.queryAll()).toEqual([]);

			expect(querySelectorAll).toHaveBeenCalledTimes(0);
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
			expect(queryBaseElement).toHaveBeenCalledTimes(0);
			await accessors.find();

			expect(mockedWaitFor.mock.calls[0][1]).toBeFalsy();
		});

		test("call `waitFor` with parameters", async () => {
			const waitForElementOptions = {
				interval: 10,
				timeout: 20,
			};

			await createAccessorsBase(queryQs, queryBaseElement, {
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

			expect(queryBaseElement).toHaveBeenCalledTimes(1);
			expect(queryBaseElement).toHaveBeenCalledWith(true);

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
			expect(queryBaseElement).toHaveBeenCalledTimes(0);
			await accessors.findAll();

			expect(mockedWaitFor.mock.calls[0][1]).toBeFalsy();
		});

		test("call `waitFor` with parameters", async () => {
			const waitForElementOptions = {
				interval: 10,
				timeout: 20,
			};

			await createAccessorsBase(queryQs, queryBaseElement, {
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

			expect(queryBaseElement).toHaveBeenCalledTimes(1);
			expect(queryBaseElement).toHaveBeenCalledWith(true);

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
		createAccessorsBase(queryQs, queryBaseElement, {
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
