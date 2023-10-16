import type { ReactElement } from "react";
import { expect, test, vi } from "vitest";
import { AccessorQueryType, create } from "..";

function Component(): ReactElement {
	return (
		<div className="field">
			<div className="label">Label</div>

			<input type="text" value="test" onChange={vi.fn()} />
		</div>
	);
}

const render = create(
	Component,
	{},
	{
		queries: {
			input: {
				query: AccessorQueryType.Text,
				parameters: ["Label"],
				mapper: (labelNode) => {
					const fieldNode = labelNode.closest(".field");

					if (!fieldNode) {
						throw new Error("field wrapper is not found");
					}

					const input = fieldNode.getElementsByTagName("input")[0];

					if (!input) {
						throw new Error("input is not found");
					}

					return input;
				},
			},
		},
	},
);

test("render input", () => {
	const engine = render({});

	expect(engine.accessors.input.get()).toHaveProperty("value", "test");
});
