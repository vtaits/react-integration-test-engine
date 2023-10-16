import type { RenderResult } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { createAccessorsBase } from "./createAccessorsBase";
import { type AccessorParamsType, AccessorQueryType } from "./types";

const qs = {
	getAllByRole: vi.fn(),
	getByRole: vi.fn(),
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

beforeEach(() => {
	Object.entries(qs).forEach(([key, mock]) => {
		mock.mockReturnValue(`${key} return`);
	});
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
	const accessors = createAccessorsBase(
		qs as unknown as RenderResult,
		{
			query: queryType,
			parameters: [
				"arg1",
				{
					checked: true,
					pressed: false,
				},
			],
		} as unknown as AccessorParamsType,
	);

	test.each([
		["getAll"],
		["get"],
		["queryAll"],
		["query"],
		["findAll"],
		["find"],
	] as const)("accessor key = %s", (accessorKey) => {
		const accessor = accessors[accessorKey];

		const functionName = `${accessorKey}By${queryName}`;

		expect(accessor()).toBe(`${functionName} return`);

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

test("throw an error for unknown query", () => {
	expect(() => {
		createAccessorsBase(
			qs as unknown as RenderResult,
			{
				query: null,
				parameters: [
					"arg1",
					{
						checked: true,
						pressed: false,
					},
				],
			} as unknown as AccessorParamsType,
		);
	}).toThrow();
});
