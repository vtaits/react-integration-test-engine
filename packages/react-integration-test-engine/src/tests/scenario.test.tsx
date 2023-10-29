import { act, cleanup, fireEvent, screen } from "@testing-library/react";
import { type ReactElement, useState } from "react";
import { afterEach, expect, test } from "vitest";
import { AccessorQueryType, create } from "..";

function Component(): ReactElement {
	const [value, setValue] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<input
				value={value}
				onChange={(event) => {
					setValue(event.target.value);
				}}
			/>

			<button
				type="button"
				onClick={() => {
					setTimeout(() => {
						setIsOpen(true);
					}, 1000);
				}}
			>
				Open dialog
			</button>

			{isOpen && <div role="dialog">Dialog</div>}
		</>
	);
}

const render = create(
	Component,
	{},
	{
		queries: {
			dialogButton: {
				query: AccessorQueryType.Text,
				parameters: ["Open dialog"],
			},

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

			openDialog: [
				"dialogButton",
				async (element) => {
					act(() => {
						fireEvent.click(element);
					});

					await screen.findByRole("dialog", undefined, {
						timeout: 1000,
					});
				},
			],
		},
	},
);

afterEach(() => {
	cleanup();
});

test("change input", async () => {
	const engine = render({});

	await engine.run("changeInput", "test");

	expect(engine.accessors.input.get()).toHaveProperty("value", "test");
});

test("open dialog", async () => {
	const engine = render({});

	await engine.run("openDialog");

	expect(engine.qs.getByRole("dialog")).toBeTruthy();
});
