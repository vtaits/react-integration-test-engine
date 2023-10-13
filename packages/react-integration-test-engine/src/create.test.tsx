import { type RenderResult, render } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { create } from "./create";
import { createAccessors } from "./createAccessors";
import {
	type AccessorParamsType,
	AccessorQueryType,
	type AccessorsType,
} from "./types";

vi.mock("@testing-library/react", () => ({
	render: vi.fn(),
}));
const mockedRender = vi.mocked(render);

vi.mock("./createAccessors");
const mockedCreateAccessors = vi.mocked(createAccessors);

type TestComponentProps = Readonly<{
	foo?: number;
	bar: string;
}>;

function TestComponent({
	foo = undefined,
	bar,
}: TestComponentProps): ReactElement {
	return <div data-foo={foo} data-bar={bar} />;
}

const defaultProps: TestComponentProps = { bar: "testBar" };

const accessors: AccessorsType = {
	getAll: vi.fn(),
	get: vi.fn(),
	queryAll: vi.fn(),
	query: vi.fn(),
	findAll: vi.fn(),
	find: vi.fn(),
};

const qs = {
	getByRole: vi.fn(),
} as unknown as RenderResult;

beforeEach(() => {
	mockedRender.mockReturnValue(qs);
	mockedCreateAccessors.mockReturnValue(accessors);
});

afterEach(() => {
	vi.resetAllMocks();
});

describe("render", () => {
	function getComponentProps() {
		expect(render).toHaveBeenCalledTimes(1);
		const node = mockedRender.mock.calls[0][0];

		expect(node.type).toBe(TestComponent);
		return node.props;
	}

	test.each([
		[
			{ foo: 3, bar: "redefinedBar" },
			{ foo: 3, bar: "redefinedBar" },
		],
		[{}, { bar: "testBar" }],
	])("provide correct props for %s", (props, expectedProps) => {
		const engine = create(TestComponent, defaultProps, {
			queries: {},
		});

		engine(props);

		expect(getComponentProps()).toEqual(expectedProps);
	});

	test("init root correctly", () => {
		const engine = create(TestComponent, defaultProps, {
			queries: {},
		});

		expect(mockedRender).toHaveBeenCalledTimes(0);

		const result = engine({});

		expect(result.qs).toBe(qs);

		expect(mockedRender).toHaveBeenCalledTimes(1);
	});
});

describe("accessors", () => {
	test("should provide multiple accessors", () => {
		const params1: AccessorParamsType = {
			query: AccessorQueryType.Role,
			parameters: ["testRole", { busy: false }],
		};

		const params2: AccessorParamsType = {
			query: AccessorQueryType.TestId,
			parameters: ["testId", { trim: false }],
		};

		const accessors1: AccessorsType = {
			getAll: vi.fn(),
			get: vi.fn(),
			queryAll: vi.fn(),
			query: vi.fn(),
			findAll: vi.fn(),
			find: vi.fn(),
		};

		const accessors2: AccessorsType = {
			getAll: vi.fn(),
			get: vi.fn(),
			queryAll: vi.fn(),
			query: vi.fn(),
			findAll: vi.fn(),
			find: vi.fn(),
		};

		mockedCreateAccessors
			.mockReturnValueOnce(accessors1)
			.mockReturnValueOnce(accessors2);

		const engine = create(TestComponent, defaultProps, {
			queries: {
				accessorKey1: params1,
				accessorKey2: params2,
			},
		});

		const result = engine({});

		expect(result.accessors.accessorKey1).toBe(accessors1);
		expect(result.accessors.accessorKey2).toBe(accessors2);

		expect(mockedCreateAccessors).toHaveBeenCalledTimes(2);
		expect(mockedCreateAccessors).toHaveBeenNthCalledWith(1, qs, params1);
		expect(mockedCreateAccessors).toHaveBeenNthCalledWith(2, qs, params2);
	});
});
