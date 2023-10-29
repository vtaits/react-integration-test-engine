import {
	type RenderResult,
	act,
	fireEvent,
	render,
} from "@testing-library/react";
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
	act: vi.fn(),
	fireEvent: {
		click: vi.fn(),
	},
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

describe("wrappers", () => {
	test("throw an error if `wrapperDefaultParams` is not provided", () => {
		expect(() => {
			const render = create(TestComponent, defaultProps, {
				queries: {},
				wrappers: {},
			});

			render({});
		}).toThrow();
	});

	test("collect rendered component", () => {
		const result1 = <div>Wrapper 1</div>;
		const wrapper1 = vi.fn().mockReturnValue([result1, null]);

		const result2 = <div>Wrapper 2</div>;
		const wrapper2 = vi.fn().mockReturnValue([result2, null]);

		const render = create(TestComponent, defaultProps, {
			queries: {},
			wrappers: {
				wrapper1,
				wrapper2,
			},
			wrapperDefaultParams: {
				wrapper1: {},
				wrapper2: {},
			},
		});

		render({});

		expect(mockedRender).toHaveBeenCalledTimes(1);
		expect(mockedRender).toHaveBeenCalledWith(result2);

		expect(wrapper2).toHaveBeenCalledTimes(1);
		expect(wrapper2.mock.calls[0][0]).toBe(result1);

		expect(wrapper1).toHaveBeenCalledTimes(1);
		expect(wrapper1.mock.calls[0][0]).toHaveProperty("type", TestComponent);
	});

	test("fill results", () => {
		const wrapper1 = vi.fn().mockReturnValue([
			<div />,
			{
				foo: "bar",
			},
		]);

		const wrapper2 = vi.fn().mockReturnValue([
			<div />,
			{
				baz: 3,
			},
		]);

		const render = create(TestComponent, defaultProps, {
			queries: {},
			wrappers: {
				wrapper1,
				wrapper2,
			},
			wrapperDefaultParams: {
				wrapper1: {},
				wrapper2: {},
			},
		});

		const { wrappers } = render({});

		expect(wrappers).toEqual({
			wrapper1: {
				foo: "bar",
			},
			wrapper2: {
				baz: 3,
			},
		});
	});

	test("call with correct parameters", () => {
		const wrapper1 = vi.fn().mockReturnValue([<div />, null]);

		const wrapper2 = vi.fn().mockReturnValue([<div />, null]);

		const render = create(TestComponent, defaultProps, {
			queries: {},
			wrappers: {
				wrapper1,
				wrapper2,
			},
			wrapperDefaultParams: {
				wrapper1: {
					param1_1: "defaultValue1_1",
					param1_2: "defaultValue1_2",
				},
				wrapper2: {
					param2_1: "defaultValue2_1",
				},
			},
		});

		render(
			{},
			{
				wrapperParams: {
					wrapper1: {
						param1_1: "redefinedValue1_1",
					},
				},
			},
		);

		expect(wrapper1).toHaveBeenCalledTimes(1);
		expect(wrapper1.mock.calls[0][1]).toEqual({
			param1_1: "redefinedValue1_1",
			param1_2: "defaultValue1_2",
		});

		expect(wrapper2).toHaveBeenCalledTimes(1);
		expect(wrapper2.mock.calls[0][1]).toEqual({
			param2_1: "defaultValue2_1",
		});
	});
});

describe("fireEvent", () => {
	test("should return value of the property", () => {
		const element = document.createElement("div");

		vi.mocked(accessors.get).mockReturnValue(element);

		const engine = create(TestComponent, defaultProps, {
			queries: {
				accessorKey: {
					query: AccessorQueryType.AltText,
					parameters: ["test"],
				},
			},
			fireEvents: {
				handleClick: ["accessorKey", "click"],
			},
		});

		const result = engine({});

		const event = {
			foo: "bar",
		};

		result.fireEvent("handleClick", event);

		expect(act).toHaveBeenCalledTimes(1);
		expect(fireEvent.click).toHaveBeenCalledTimes(0);

		vi.mocked(act).mock.calls[0][0]();

		expect(fireEvent.click).toHaveBeenCalledTimes(1);
		expect(fireEvent.click).toHaveBeenCalledWith(element, event);
	});

	test("should throw an error if `fireEvents` is not provided", () => {
		const element = document.createElement("div");

		vi.mocked(accessors.get).mockReturnValue(element);

		const engine = create(TestComponent, defaultProps, {
			queries: {
				accessorKey: {
					query: AccessorQueryType.AltText,
					parameters: ["test"],
				},
			},
		});

		const result = engine({});

		expect(() => {
			result.fireEvent("handleClick");
		}).toThrow();
	});
});

describe("run", () => {
	test("should run scenario by key", async () => {
		const element = document.createElement("div");

		vi.mocked(accessors.get).mockReturnValue(element);

		const scenario = vi.fn();

		const engine = create(TestComponent, defaultProps, {
			queries: {
				accessorKey: {
					query: AccessorQueryType.AltText,
					parameters: ["test"],
				},
			},
			scenarios: {
				testRun: ["accessorKey", scenario],
			},
		});

		const result = engine({});

		await result.run("testRun", "foo", "bar");

		expect(scenario).toHaveBeenCalledTimes(1);
		expect(scenario).toHaveBeenCalledWith(element, "foo", "bar");
	});

	test("should throw an error if `scenarios` is not provided", async () => {
		const element = document.createElement("div");

		vi.mocked(accessors.get).mockReturnValue(element);

		const engine = create(TestComponent, defaultProps, {
			queries: {
				accessorKey: {
					query: AccessorQueryType.AltText,
					parameters: ["test"],
				},
			},
		});

		const result = engine({});

		let hasError = false;

		try {
			await result.run("testRun");
		} catch (e) {
			hasError = true;
		}

		expect(hasError).toBe(true);
	});
});
