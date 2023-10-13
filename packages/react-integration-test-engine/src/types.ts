import type { EventType, RenderResult } from "@testing-library/react";
import type { ReactElement } from "react";

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

export type AccessorsType = Readonly<{
	getAll: () => HTMLElement[];
	get: () => HTMLElement;
	queryAll: () => HTMLElement[];
	query: () => HTMLElement | null;
	findAll: () => Promise<HTMLElement[]>;
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
	queries: Queries;
	wrappers?: Wrappers;
	wrapperDefaultParams?: {
		[Key in keyof Wrappers]: Parameters<Wrappers[Key]>[1];
	};
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
	qs: RenderResult;
	accessors: {
		[Key in keyof Queries]: AccessorsType;
	};
	wrappers: {
		[Key in keyof Wrappers]: ReturnType<Wrappers[Key]>[1];
	};
	// biome-ignore lint/complexity/noBannedTypes: the format of `@testing-library/react`
	fireEvent: (eventKey: keyof FireEvents, options?: {} | undefined) => void;
}>;
