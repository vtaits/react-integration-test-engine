import type { ReactElement } from "react";
import { expect, test } from "vitest";
import { AccessorQueryType, create } from "..";

type NestedComponentProps = Readonly<{
	roleContent: string;
}>;

function NestedComponent({ roleContent }: NestedComponentProps): ReactElement {
	return (
		<>
			<div role="caption">{roleContent}</div>
		</>
	);
}

type Props = Readonly<{
	labelContent: string;
	roleContent: string;
}>;

function Component({ labelContent, roleContent }: Props): ReactElement {
	return (
		<>
			<div aria-label="testLabel">{labelContent}</div>

			<NestedComponent roleContent={roleContent} />
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
			withLabel: {
				query: AccessorQueryType.QuerySelector,
				parameters: ['[aria-label="testLabel"]'],
			},

			withRole: {
				query: AccessorQueryType.QuerySelector,
				parameters: ['[role="caption"]'],
			},
		},
	},
);

test("render components", () => {
	const engine = render({
		labelContent: "Test conent for element with aria-label",
		roleContent: "Test conent for element with role",
	});

	expect(engine.accessors.withLabel.get().textContent).toBe(
		"Test conent for element with aria-label",
	);
	expect(engine.accessors.withRole.get().textContent).toBe(
		"Test conent for element with role",
	);
});
