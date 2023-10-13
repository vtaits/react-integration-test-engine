import type { RenderResult } from "@testing-library/react";

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

/**
 * Options of the engine
 */
export type OptionsType<Queries extends Record<string, AccessorParamsType>,> = {
	queries: Queries;
};

export type EngineType<Queries extends Record<string, AccessorParamsType>,> = {
	qs: RenderResult;
	accessors: {
		[Key in keyof Queries]: AccessorsType;
	};
};
