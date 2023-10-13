import { render } from "@testing-library/react";
import mapValues from "lodash/mapValues";
import type { ComponentType } from "react";

import { createAccessors } from "./createAccessors";
import type {
	AccessorParamsType,
	AccessorsType,
	EngineType,
	OptionsType,
	WrapperType,
} from "./types";

export function create<
	Props,
	Queries extends Record<string, AccessorParamsType>,
	Wrappers extends Record<
		string,
		// biome-ignore lint/suspicious/noExplicitAny: supports any params and result
		WrapperType<any, any>
	>,
>(
	Component: ComponentType<Props>,
	defaultProps: Props,
	{ queries, wrappers, wrapperDefaultParams }: OptionsType<Queries, Wrappers>,
) {
	const renderEngine = (
		props: Partial<Props>,
		{
			wrapperParams = {},
		}: {
			wrapperParams?: Partial<{
				[Key in keyof Wrappers]: Parameters<Wrappers[Key]>[1];
			}>;
		} = {},
	): EngineType<Queries, Wrappers> => {
		let component = <Component {...defaultProps} {...props} />;

		const wrapperResults: Partial<{
			[Key in keyof Wrappers]: ReturnType<Wrappers[Key]>[1];
		}> = {};

		if (wrappers) {
			if (!wrapperDefaultParams) {
				throw new Error(
					"[react-integration-test-engine] `wrapperDefaultParams` should be provided if `wrappers` is provided",
				);
			}

			Object.entries(wrappers).forEach(([wrapperKey, wrapper]) => {
				const [nextComponent, wrapperResult] = wrapper(component, {
					...wrapperDefaultParams[wrapperKey],
					...wrapperParams[wrapperKey],
				});

				component = nextComponent;
				wrapperResults[wrapperKey as keyof Wrappers] = wrapperResult;
			});
		}

		const qs = render(component);

		const accessors = mapValues(queries, (accessorsParams) =>
			createAccessors(qs, accessorsParams),
		) as {
			[Key in keyof Queries]: AccessorsType;
		};

		return {
			accessors,
			qs,
			wrappers: wrapperResults as {
				[Key in keyof Wrappers]: ReturnType<Wrappers[Key]>[1];
			},
		};
	};

	return renderEngine;
}
