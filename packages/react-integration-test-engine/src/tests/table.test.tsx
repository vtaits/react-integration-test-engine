import type { ReactElement, ReactNode } from "react";
import { expect, test } from "vitest";
import { AccessorQueryType, create } from "..";

type RowType = Readonly<{
	id: number;
	foo: ReactNode;
	bar: ReactNode;
	baz: ReactNode;
}>;

type Props = Readonly<{
	rows: readonly RowType[];
}>;

function Component({ rows }: Props): ReactElement {
	return (
		<table>
			<tbody>
				{rows.map(({ id, foo, bar, baz }) => (
					<tr key={id}>
						<td>{foo}</td>
						<td>{bar}</td>
						<td>{baz}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

const defaultProps: Props = {
	rows: [],
};

const render = create(Component, defaultProps, {
	queries: {
		table: {
			query: AccessorQueryType.QuerySelector,
			parameters: ["table"],
		},
	},
	scenarios: {
		getRenderedRow: [
			"table",
			(tableNode, index: number) => {
				const tableRow = tableNode.querySelector(`tr:nth-child(${index})`);

				if (!tableRow || !(tableRow instanceof HTMLElement)) {
					throw new Error("row is not rendered");
				}

				return [...tableRow.childNodes].map((node) => node.textContent);
			},
		],
	},
});

test("render rows", () => {
	const engine = render({
		rows: [
			{
				id: 1,
				foo: "foo 1",
				bar: "bar 1",
				baz: "baz 1",
			},
			{
				id: 2,
				foo: "foo 2",
				bar: "bar 2",
				baz: "baz 2",
			},
		],
	});

	expect(engine.run("getRenderedRow", 1)).toEqual(["foo 1", "bar 1", "baz 1"]);
	expect(engine.run("getRenderedRow", 2)).toEqual(["foo 2", "bar 2", "baz 2"]);
});
