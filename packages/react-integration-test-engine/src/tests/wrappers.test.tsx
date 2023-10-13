import { act, cleanup, fireEvent } from "@testing-library/react";
import { type ReactElement, createContext, useContext } from "react";
import { afterEach, expect, test } from "vitest";
import { AccessorQueryType, type WrapperType, create } from "..";

const WrapperContext = createContext({
	increase: () => {},
});

const counterWrapper: WrapperType<
	{
		initialValue: number;
	},
	{
		getValue: () => number;
	}
> = (children: ReactElement, { initialValue }) => {
	let value = initialValue;

	const increase = () => {
		++value;
	};

	const getValue = () => value;

	return [
		<WrapperContext.Provider
			value={{
				increase,
			}}
		>
			{children}
		</WrapperContext.Provider>,
		{
			getValue,
		},
	];
};

const dummyWrapper: WrapperType<Record<string, unknown>, null> = (
	children: ReactElement,
) => [children, null];

function Component(): ReactElement {
	const { increase } = useContext(WrapperContext);

	return (
		<button type="button" onClick={increase}>
			Increase
		</button>
	);
}

const render = create(
	Component,
	{},
	{
		queries: {
			button: {
				query: AccessorQueryType.Text,
				parameters: ["Increase"],
			},
		},

		wrappers: {
			counter: counterWrapper,
			dummy: dummyWrapper,
		},

		wrapperDefaultParams: {
			counter: {
				initialValue: 0,
			},

			dummy: {},
		},
	},
);

afterEach(() => {
	cleanup();
});

test("render button", () => {
	const engine = render({});

	expect(engine.accessors.button.get().textContent).toBe("Increase");
});

test("increase value", () => {
	const engine = render(
		{},
		{
			wrapperParams: {
				counter: {
					initialValue: 5,
				},
			},
		},
	);

	expect(engine.wrappers.counter.getValue()).toBe(5);

	act(() => {
		fireEvent.click(engine.accessors.button.get());
	});

	expect(engine.wrappers.counter.getValue()).toBe(6);

	act(() => {
		fireEvent.click(engine.accessors.button.get());
	});

	expect(engine.wrappers.counter.getValue()).toBe(7);
});
