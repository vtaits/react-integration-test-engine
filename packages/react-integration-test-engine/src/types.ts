import type { EventType, RenderResult } from "@testing-library/react";
import type { ReactElement } from "react";

/**
 * Type of `testing-library` query
 *
 * See https://testing-library.com/docs/queries/about/#priority
 */
export enum AccessorQueryType {
	Role = "Role",
	LabelText = "LabelText",
	PlaceholderText = "PlaceholderText",
	Text = "Text",
	DisplayValue = "DisplayValue",
	AltText = "AltText",
	Title = "Title",
	TestId = "TestId",
}

/**
 * Type of the result of `testing-library` query
 *
 * See https://testing-library.com/docs/queries/about/#types-of-queries
 */
export type AccessorsType = Readonly<{
	/**
	 * @returns all matched elements
	 * @throws if there are no matched elements
	 */
	getAll: () => HTMLElement[];
	/**
	 * @returns a single matched element
	 * @throws if there are no matched elements
	 * @throws if there are more than one matched elements
	 */
	get: () => HTMLElement;
	/**
	 * @returns all matched elements
	 */
	queryAll: () => HTMLElement[];
	/**
	 * @returns a single matched element or null
	 * @throws if there are more than one matched elements
	 */
	query: () => HTMLElement | null;
	/**
	 * wait for mathed elements and return them
	 * @returns promise with all matched elements
	 * @throws if there are no matched elements
	 */
	findAll: () => Promise<HTMLElement[]>;
	/**
	 * wait for single mathed element and return them
	 * @returns promise with all matched elements
	 * @throws if there are no matched elements
	 * @throws if there are more than one matched elements
	 */
	find: () => Promise<HTMLElement>;
}>;

export type AccessorParamsType = Readonly<
	| {
			query: AccessorQueryType.Role;
			parameters: Parameters<RenderResult["getByRole"]>;
	  }
	| {
			query: AccessorQueryType.LabelText;
			parameters: Parameters<RenderResult["getByLabelText"]>;
	  }
	| {
			query: AccessorQueryType.PlaceholderText;
			parameters: Parameters<RenderResult["getByPlaceholderText"]>;
	  }
	| {
			query: AccessorQueryType.Text;
			parameters: Parameters<RenderResult["getByText"]>;
	  }
	| {
			query: AccessorQueryType.DisplayValue;
			parameters: Parameters<RenderResult["getByDisplayValue"]>;
	  }
	| {
			query: AccessorQueryType.AltText;
			parameters: Parameters<RenderResult["getByAltText"]>;
	  }
	| {
			query: AccessorQueryType.Title;
			parameters: Parameters<RenderResult["getByTitle"]>;
	  }
	| {
			query: AccessorQueryType.TestId;
			parameters: Parameters<RenderResult["getByTestId"]>;
	  }
>;

/**
 * A wrapper for current component. Can be used for integration
 * with `react-router`, `react-redux` or other component that provided context
 * that used in target component
 *
 * See an example https://github.com/vtaits/react-integration-test-engine/blob/main/packages/react-integration-test-engine/src/tests/wrappers.test.tsx
 *
 * @param children react tree that should be wrapped
 * @param params parameters of the wrapper
 * @returns a tupple with first element is the wrapped react tree and
 * the second element is the result of the wrapper that can be accessed from engine
 */
export type WrapperType<
	ParamsType extends Record<string, unknown>,
	ResultType,
> = (children: ReactElement, params: ParamsType) => [ReactElement, ResultType];

/**
 * Options of the engine
 */
export type OptionsType<
	Queries extends Record<string, AccessorParamsType>,
	Wrappers extends Record<
		string,
		// biome-ignore lint/suspicious/noExplicitAny: supports any params and result
		WrapperType<any, any>
	>,
	FireEvents extends Record<string, [keyof Queries, EventType]>,
> = Readonly<{
	/**
	 * An object whose values is queries to rendered elements, and keys can be used to access them
	 *
	 * ```
	 * const render = create(Component, defaultProps, {
	 *   queries: {
	 *     listItem: {
	 *       query: AccessorQueryType.LabelText,
	 *       parameters: ["the item of the list"],
	 *     },
	 *
	 *     navigation: {
	 *       query: AccessorQueryType.Role,
	 *       parameters: ["navigation"],
	 *     },
	 *   },
	 * });
	 *
	 * const engine = render({});
	 *
	 * const listItems = page.accessors.listItem.getAll();
	 * const navigation = page.accessors.navigation.get();
	 * ```
	 */
	queries: Queries;
	wrappers?: Wrappers;
	wrapperDefaultParams?: {
		[Key in keyof Wrappers]: Parameters<Wrappers[Key]>[1];
	};
	/**
	 * An object whose values is tupples of keys of queries and names of events
	 *
	 * ```
	 * const render = create(Component, defaultProps, {
	 *   queries: {
	 *     button: {
	 *       query: AccessorQueryType.Text,
	 *       parameters: ["Click me"],
	 *     },
	 *   },
	 *
	 *   fireEvents: {
	 *     buttonClick: ["button", "click"],
	 *   },
	 * });
	 *
	 * const engine = render({});
	 *
	 * engine.fireEvent("buttonClick");
	 * ```
	 */
	fireEvents?: FireEvents;
}>;

export type EngineType<
	Queries extends Record<string, AccessorParamsType>,
	Wrappers extends Record<
		string,
		// biome-ignore lint/suspicious/noExplicitAny: supports any params and result
		WrapperType<any, any>
	>,
	FireEvents extends Record<string, [keyof Queries, EventType]>,
> = Readonly<{
	/**
	 * Result of `render` of `@testing-library/react`
	 */
	qs: RenderResult;
	/**
	 * An object whose keys are keys of the `queries` parameter and whose values are accessors (see `AccessorsType`)
	 *
	 * ```
	 * const render = create(Component, defaultProps, {
	 *   queries: {
	 *     listItem: {
	 *       query: AccessorQueryType.LabelText,
	 *       parameters: ["the item of the list"],
	 *     },
	 *
	 *     navigation: {
	 *       query: AccessorQueryType.Role,
	 *       parameters: ["navigation"],
	 *     },
	 *   },
	 * });
	 *
	 * const engine = render({});
	 *
	 * const listItems = page.accessors.listItem.getAll();
	 * const navigation = page.accessors.navigation.get();
	 * ```
	 */
	accessors: {
		[Key in keyof Queries]: AccessorsType;
	};
	wrappers: {
		[Key in keyof Wrappers]: ReturnType<Wrappers[Key]>[1];
	};
	/**
	 * Fire an event in `act` wrapper
	 * @param eventKey a key of the `fireEvents` parameter
	 * @param options optional, an event object
	 * @throws if `fireEvents` is not provided
	 *
	 * ```
	 * const render = create(Component, defaultProps, {
	 *   queries: {
	 *     button: {
	 *       query: AccessorQueryType.Text,
	 *       parameters: ["Click me"],
	 *     },
	 *   },
	 *
	 *   fireEvents: {
	 *     buttonClick: ["button", "click"],
	 *   },
	 * });
	 *
	 * const engine = render({});
	 *
	 * engine.fireEvent("buttonClick");
	 * ```
	 */
	// biome-ignore lint/complexity/noBannedTypes: the format of `@testing-library/react`
	fireEvent: (eventKey: keyof FireEvents, options?: {} | undefined) => void;
}>;
