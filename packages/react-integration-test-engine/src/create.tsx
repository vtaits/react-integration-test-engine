import { type EventType, act, fireEvent, render } from "@testing-library/react";
import mapValues from "lodash/mapValues";
import type { ComponentType } from "react";

import { createAccessors } from "./createAccessors";
import type {
	AccessorParamsType,
	AccessorsType,
	EngineType,
	OptionsType,
	RunScenatioParameters,
	WrapperType,
} from "./types";

/**
 * Creates function that initializes engine for integration testing of react components
 * @param Component target component
 * @param defaultProps stubs for required props
 * @param parameters named accessors, wrappers, events etc.
 * @returns
 */
export function create<
	Props,
	Queries extends Record<string, AccessorParamsType>,
	Wrappers extends Record<
		string,
		// biome-ignore lint/suspicious/noExplicitAny: supports any params and result
		WrapperType<any, any>
	>,
	FireEvents extends Record<string, [keyof Queries, EventType]>,
	Scenarios extends Record<
		string,
		// biome-ignore lint/suspicious/noExplicitAny: supports any arguments
		[keyof Queries, (element: HTMLElement, ...args: any[]) => Promise<void>]
	>,
>(
	Component: ComponentType<Props>,
	defaultProps: Props,
	{
		fireEvents,
		queries,
		wrappers,
		wrapperDefaultParams,
		scenarios,
	}: OptionsType<Queries, Wrappers, FireEvents, Scenarios>,
) {
	/**
	 * function that renders components and initializes accessors, events, wrappers etc.
	 * @param props props of target component
	 * @param parameters parameters of wrappers
	 * @returns engine for integration testing
	 */
	const renderEngine = (
		props: Partial<Props>,
		{
			wrapperParams = {},
		}: {
			wrapperParams?: Partial<{
				[Key in keyof Wrappers]: Parameters<Wrappers[Key]>[1];
			}>;
		} = {},
	): EngineType<Queries, Wrappers, FireEvents, Scenarios> => {
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

		const callFireEvent = (
			eventKey: keyof FireEvents,
			// biome-ignore lint/complexity/noBannedTypes: the format of `@testing-library/react`
			options?: {} | undefined,
		) => {
			if (!fireEvents) {
				throw new Error(
					"[react-integration-test-engine] `fireEvents` is not provided",
				);
			}

			const [accessor, nativeFireEventKey] = fireEvents[eventKey];

			const element = accessors[accessor].get();

			act(() => {
				fireEvent[nativeFireEventKey](element, options);
			});
		};

		const run = async <Key extends keyof Scenarios>(
			scenarioKey: Key,
			...args: RunScenatioParameters<Scenarios[Key][1]>
		) => {
			if (!scenarios) {
				throw new Error(
					"[react-integration-test-engine] `scenarios` is not provided",
				);
			}

			const [accessor, scenario] = scenarios[scenarioKey];

			const element = accessors[accessor].get();

			await scenario(element, ...args);
		};

		return {
			accessors,
			fireEvent: callFireEvent,
			qs,
			wrappers: wrapperResults as {
				[Key in keyof Wrappers]: ReturnType<Wrappers[Key]>[1];
			},
			run,
		};
	};

	return renderEngine;
}
