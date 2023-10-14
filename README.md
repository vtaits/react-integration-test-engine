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
