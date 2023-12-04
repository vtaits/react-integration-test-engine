import {
	act,
	cleanup,
	fireEvent,
	screen,
	within,
} from "@testing-library/react";
import { type ReactElement, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { afterEach, expect, test } from "vitest";
import { AccessorQueryType, create } from "..";

function Component(): ReactElement {
	const [value, setValue] = useState("");
	const [date, setDate] = useState<Date | null>(() => new Date(2023, 9, 20));

	return (
		<>
			<input
				className="simple"
				value={value}
				onChange={(event) => {
					setValue(event.target.value);
				}}
			/>

			<ReactDatePicker selected={date} onChange={setDate} />
		</>
	);
}

const render = create(
	Component,
	{},
	{
		queries: {
			dateInput: {
				query: AccessorQueryType.QuerySelector,
				parameters: [".react-datepicker__input-container input"],
			},

			input: {
				query: AccessorQueryType.QuerySelector,
				parameters: ["input.simple"],
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
				},
			],

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

afterEach(() => {
	cleanup();
});

test("input", () => {
	const engine = render({});

	engine.run("changeInput", "test");

	expect(engine.accessors.input.get()).toHaveProperty("value", "test");
});

test("date picker", async () => {
	const engine = render({});

	await engine.run("changeDatepicker", 1);

	expect(engine.accessors.dateInput.get()).toHaveProperty(
		"value",
		"10/01/2023",
	);
});
