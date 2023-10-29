# react-integration-test-engine

[![NPM](https://img.shields.io/npm/v/react-integration-test-engine.svg)](https://www.npmjs.com/package/react-integration-test-engine)
![dependencies status](https://img.shields.io/librariesio/release/npm/react-integration-test-engine)

Unit test utils for react components

[Api reference](https://vtaits.github.io/react-integration-test-engine/)

## Examples

- [Simple component](https://github.com/vtaits/react-integration-test-engine/blob/main/packages/react-integration-test-engine/src/tests/render.test.tsx)
- [Wrappers](https://github.com/vtaits/react-integration-test-engine/blob/main/packages/react-integration-test-engine/src/tests/wrappers.test.tsx)

## Installation

```sh
npm install react-integration-test-engine @testing-library/react --save-dev
```

or

```sh
yarn add react-integration-test-engine @testing-library/react --dev
```

## Quickstart

Let's test a component. I'm using `vitest`, but you can use your favourite test framework

```tsx
import type {
	ReactElement,
} from "react";

type Props = {
	callback: (foo: number, bar: string) => void;
};

function Component({
	callback,
}: Props): ReactElement | null {
	const onClick = useCallback(() => {
		callback(1, "2");
	}, [callback]);

	return (
		<div className="my-wrapper">
			<button type="button" onClick={onClick}>
				Click me
			</button>
		</div>
	);
}
```

At first, we have to define stubs for required props of the component

```tsx
import { vi } from "vitest";

const defaultProps: Props = {
	callback: vi.fn(),
};
```

Then let's describe accsessors of rendered components. In this case, only `button` is needed. Let's call it "targetButton"

```tsx
import { create, AccessorQueryType } from "react-integration-test-engine";

const render = create(Component, defaultProps, {
	queries: {
		button: {
			query: AccessorQueryType.Text,
			parameters: ["Click me"],
		},
	},
});
```

A boilerplate is ready. Let's write a test that checks for the correct render of the content of the button

```tsx
import { expect, test } from "vitest";

test("should render children correctly", () => {
	const engine = render({});

	expect(engine.accessors.button.get().textContent).toBe("Click me");
});
```

A method `get` is used here, but you can use other methods. The full list:

- `getAll` - returns all matched elements
	getAll: () => HTMLElement[];
- `get` - returns a single matched element or throws if there are no matched elements or throws if there are more than one matched elements
	get: () => HTMLElement;
- `queryAll` - returns all matched elements
	queryAll: () => HTMLElement[];
- `query` - returns a single matched element or `null` if there are no matched elements or throws if there are more than one matched elements
	query: () => HTMLElement | null;
- `findAll` - similar to `getAll`, but waits for matched elements
	findAll: () => Promise<HTMLElement[]>;
- `find` - similar to `get`, but waits for matched elements
	find: () => Promise<HTMLElement>;

[testing-library](https://testing-library.com/docs/queries/about/#types-of-queries) is used.

Then let's test a callback. There's an easy way to do it. Let's change definition a little

```tsx
import { create, AccessorQueryType } from "react-integration-test-engine";

const render = create(Component, defaultProps, {
	queries: {
		button: {
			query: AccessorQueryType.Text,
			parameters: ["Click me"],
		},
	},
	// !!!!!!!!!!!!!!!
	// ADDED `fireEvents` SECTION
	fireEvents: {
		buttonClick: ["button", "click"],
	},
});
```

The first value of the tupple is the key of `queries`. The second value is the type of the event

Let's write a test for the callback:

```tsx
import type { MouseEvent } from "react";
import { expect, test, vi } from "vitest";

test("should call callback correctly", () => {
	const callback = vi.fn();

	const engine = render({
		callback,
	});

	const event = {};

	engine.fireEvent("buttonClick");

	expect(callback).toHaveBeenCalledTimes(1);
	expect(callback).toHaveBeenCalledWith(1, "2");
});
```

## Scenarios

`fireEvent` is not enough for actions that required several user interactions, e.g. selecting of value from dropdown or date picker etc.

There is a property `scenarios` in the constuctor of engine. You can call the scenario with the `run` method of the engine.

Differences from `events`:

1. Allow multiple interactions;

2. Asynchronous;

3. Doesn't invoke `act` automatically.

Let's write an example test with selecting the value of `react-datepicker` (version `4.21.0`):

At first, let's write a component for testing:

```tsx
import { type ReactElement, useState } from "react";
import ReactDatePicker from "react-datepicker";

function Component(): ReactElement {
	const [date, setDate] = useState<Date | null>(() => new Date(2023, 9, 20));

	return (
		<ReactDatePicker selected={date} onChange={setDate} />
	);
}
```

Then let's define the engine constructor:

```tsx
import {
	act,
	fireEvent,
	screen,
	within,
} from "@testing-library/react";
import { AccessorQueryType, create } from "react-integration-test-engine";

const render = create(
	Component,
	{},
	{
		queries: {
			dateInput: {
				query: AccessorQueryType.QuerySelector,
				parameters: [".react-datepicker__input-container input"],
			},
		},

		scenarios: {
			changeDatepicker: [
				"dateInput",
				async (element, day: number) => {
					act(() => {
						fireEvent.focus(element);
					});

					const listbox = await screen.findByRole("listbox");

					const dayButton = within(listbox).getByText(`${day}`, {
						ignore: ".react-datepicker__day--outside-month",
					});

					act(() => {
						fireEvent.click(dayButton);
					});
				},
			],
		},
	},
);
```

Then let's write a test to change the date:

```tsx
test("date change", async () => {
	const engine = render({});

	await engine.run("changeDatepicker", 1);

	expect(engine.accessors.dateInput.get()).toHaveProperty(
		"value",
		"10/01/2023",
	);
});
```
