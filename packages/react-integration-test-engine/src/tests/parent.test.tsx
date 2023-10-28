import { cleanup } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, expect, test } from "vitest";
import { AccessorQueryType, create } from "..";

type NestedComponentProps = Readonly<{
	wrapperLabel: string;
	children: string;
}>;

function NestedComponent({
	children,
	wrapperLabel,
}: NestedComponentProps): ReactElement {
	return (
		<div aria-label={wrapperLabel}>
			<div aria-label="testLabel">{children}</div>
		</div>
	);
}

function Component(): ReactElement {
	return (
		<>
			<NestedComponent wrapperLabel="wrapper1">Content 1</NestedComponent>
			<NestedComponent wrapperLabel="wrapper2">Content 2</NestedComponent>
		</>
	);
}

const render = create(
	Component,
	{
		labelContent: "",
		roleContent: "",
	},
	{
		queries: {
			label1: {
				query: AccessorQueryType.LabelText,
				parameters: ["testLabel"],
				parent: {
					query: AccessorQueryType.LabelText,
					parameters: ["wrapper1"],
				},
			},

			label2: {
				query: AccessorQueryType.LabelText,
				parameters: ["testLabel"],
				parent: {
					query: AccessorQueryType.LabelText,
					parameters: ["wrapper2"],
				},
			},

			label3: {
				query: AccessorQueryType.LabelText,
				parameters: ["testLabel"],
				parent: {
					query: AccessorQueryType.LabelText,
					parameters: ["wrapper3"],
				},
			},

			querySelector1: {
				query: AccessorQueryType.QuerySelector,
				parameters: ['[aria-label="testLabel"]'],
				parent: {
					query: AccessorQueryType.QuerySelector,
					parameters: ['[aria-label="wrapper1"]'],
				},
			},

			querySelector2: {
				query: AccessorQueryType.QuerySelector,
				parameters: ['[aria-label="testLabel"]'],
				parent: {
					query: AccessorQueryType.QuerySelector,
					parameters: ['[aria-label="wrapper2"]'],
				},
			},

			querySelector3: {
				query: AccessorQueryType.QuerySelector,
				parameters: ['[aria-label="testLabel"]'],
				parent: {
					query: AccessorQueryType.QuerySelector,
					parameters: ['[aria-label="wrapper3"]'],
				},
			},
		},
	},
);

afterEach(() => {
	cleanup();
});

test("semantic queries", () => {
	const engine = render({});

	expect(engine.accessors.label1.get().textContent).toBe("Content 1");
	expect(engine.accessors.label2.get().textContent).toBe("Content 2");
	expect(engine.accessors.label3.query()).toBeFalsy();
});

test("querySelector", () => {
	const engine = render({});

	expect(engine.accessors.querySelector1.get().textContent).toBe("Content 1");
	expect(engine.accessors.querySelector2.get().textContent).toBe("Content 2");
	expect(engine.accessors.querySelector3.query()).toBeFalsy();
});
