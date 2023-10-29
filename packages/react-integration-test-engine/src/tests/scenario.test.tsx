import { act, fireEvent } from "@testing-library/react";
import { type ReactElement, useState } from "react";
import { expect, test } from "vitest";
import { AccessorQueryType, create } from "..";

function Component(): ReactElement {
	const [value, setValue] = useState("");

	return (
		<input
			value={value}
			onChange={(event) => {
				setValue(event.target.value);
			}}
		/>
	);
}

const render = create(
	Component,
	{},
	{
		queries: {
			input: {
				query: AccessorQueryType.QuerySelector,
				parameters: ["input"],
			},
		},

		scenarios: {
			changeInput: [
				"input",
				(element, value: string) => {
					act(() => {
						fireEvent.change(element, {
							target: {
								value,
							},
						});
					});

					return Promise.resolve();
				},
			],
		},
	},
);

test("render components", () => {
	const engine = render({});

	engine.run("changeInput", "test");

	expect(engine.accessors.input.get()).toHaveProperty("value", "test");
});
