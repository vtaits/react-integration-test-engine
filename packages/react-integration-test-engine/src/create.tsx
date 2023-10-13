import { render } from "@testing-library/react";
import mapValues from "lodash/mapValues";
import { ComponentType } from "react";

import { createAccessors } from "./createAccessors";
import type {
	AccessorParamsType,
	AccessorsType,
	EngineType,
	OptionsType,
} from "./types";

export function create<
	Props,
	Queries extends Record<string, AccessorParamsType>,
>(
	Component: ComponentType<Props>,
	defaultProps: Props,
	{ queries }: OptionsType<Queries>,
) {
	const renderEngine = (props: Partial<Props>): EngineType<Queries> => {
		const qs = render(<Component {...defaultProps} {...props} />);

		const accessors = mapValues(queries, (accessorsParams) =>
			createAccessors(qs, accessorsParams),
		) as {
			[Key in keyof Queries]: AccessorsType;
		};

		return {
			accessors,
			qs,
		};
	};

	return renderEngine;
}
