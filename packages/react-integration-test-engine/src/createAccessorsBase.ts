import { type RenderResult, waitFor } from "@testing-library/react";
import {
	type AccessorParamsType,
	AccessorQueryType,
	type AccessorsType,
} from "./types";

export function createAccessorsBase(
	qs: RenderResult,
	params: AccessorParamsType,
): AccessorsType {
	switch (params.query) {
		case AccessorQueryType.Role:
			return {
				getAll: () => qs.getAllByRole(...params.parameters),
				get: () => qs.getByRole(...params.parameters),
				queryAll: () => qs.queryAllByRole(...params.parameters),
				query: () => qs.queryByRole(...params.parameters),
				findAll: () => qs.findAllByRole(...params.parameters),
				find: () => qs.findByRole(...params.parameters),
			};

		case AccessorQueryType.LabelText:
			return {
				getAll: () => qs.getAllByLabelText(...params.parameters),
				get: () => qs.getByLabelText(...params.parameters),
				queryAll: () => qs.queryAllByLabelText(...params.parameters),
				query: () => qs.queryByLabelText(...params.parameters),
				findAll: () => qs.findAllByLabelText(...params.parameters),
				find: () => qs.findByLabelText(...params.parameters),
			};

		case AccessorQueryType.PlaceholderText:
			return {
				getAll: () => qs.getAllByPlaceholderText(...params.parameters),
				get: () => qs.getByPlaceholderText(...params.parameters),
				queryAll: () => qs.queryAllByPlaceholderText(...params.parameters),
				query: () => qs.queryByPlaceholderText(...params.parameters),
				findAll: () => qs.findAllByPlaceholderText(...params.parameters),
				find: () => qs.findByPlaceholderText(...params.parameters),
			};

		case AccessorQueryType.Text:
			return {
				getAll: () => qs.getAllByText(...params.parameters),
				get: () => qs.getByText(...params.parameters),
				queryAll: () => qs.queryAllByText(...params.parameters),
				query: () => qs.queryByText(...params.parameters),
				findAll: () => qs.findAllByText(...params.parameters),
				find: () => qs.findByText(...params.parameters),
			};

		case AccessorQueryType.DisplayValue:
			return {
				getAll: () => qs.getAllByDisplayValue(...params.parameters),
				get: () => qs.getByDisplayValue(...params.parameters),
				queryAll: () => qs.queryAllByDisplayValue(...params.parameters),
				query: () => qs.queryByDisplayValue(...params.parameters),
				findAll: () => qs.findAllByDisplayValue(...params.parameters),
				find: () => qs.findByDisplayValue(...params.parameters),
			};

		case AccessorQueryType.AltText:
			return {
				getAll: () => qs.getAllByAltText(...params.parameters),
				get: () => qs.getByAltText(...params.parameters),
				queryAll: () => qs.queryAllByAltText(...params.parameters),
				query: () => qs.queryByAltText(...params.parameters),
				findAll: () => qs.findAllByAltText(...params.parameters),
				find: () => qs.findByAltText(...params.parameters),
			};

		case AccessorQueryType.Title:
			return {
				getAll: () => qs.getAllByTitle(...params.parameters),
				get: () => qs.getByTitle(...params.parameters),
				queryAll: () => qs.queryAllByTitle(...params.parameters),
				query: () => qs.queryByTitle(...params.parameters),
				findAll: () => qs.findAllByTitle(...params.parameters),
				find: () => qs.findByTitle(...params.parameters),
			};

		case AccessorQueryType.TestId:
			return {
				getAll: () => qs.getAllByTestId(...params.parameters),
				get: () => qs.getByTestId(...params.parameters),
				queryAll: () => qs.queryAllByTestId(...params.parameters),
				query: () => qs.queryByTestId(...params.parameters),
				findAll: () => qs.findAllByTestId(...params.parameters),
				find: () => qs.findByTestId(...params.parameters),
			};

		case AccessorQueryType.QuerySelector: {
			const { baseElement } = qs;

			const [selector, options] = params.parameters;

			return {
				getAll: () => {
					const result = baseElement.querySelectorAll(selector);

					if (result.length === 0) {
						throw new Error(
							`[react-integration-test-engine] there is no matched elements for the selector "${selector}"`,
						);
					}

					return [...result] as HTMLElement[];
				},

				get: () => {
					const result = baseElement.querySelectorAll(selector);

					if (result.length === 0) {
						throw new Error(
							`[react-integration-test-engine] there is no matched elements for the selector "${selector}"`,
						);
					}

					if (result.length > 1) {
						throw new Error(
							`[react-integration-test-engine] there is no matched elements for the selector "${selector}"`,
						);
					}

					return result[0] as HTMLElement;
				},

				queryAll: () => {
					const result = baseElement.querySelectorAll(selector);

					return [...result] as HTMLElement[];
				},

				query: () => {
					const result = baseElement.querySelectorAll(selector);

					if (result.length === 0) {
						return null;
					}

					if (result.length > 1) {
						throw new Error(
							`[react-integration-test-engine] there is no matched elements for the selector "${selector}"`,
						);
					}

					return result[0] as HTMLElement;
				},

				findAll: async () => {
					const waitForElementOptions = options?.waitForElementOptions;

					const result = await waitFor(() => {
						const iterResult = baseElement.querySelectorAll(selector);

						if (iterResult.length === 0) {
							throw new Error(
								`[react-integration-test-engine] there is no matched elements for the selector "${selector}"`,
							);
						}

						return [...iterResult] as HTMLElement[];
					}, waitForElementOptions);

					return result;
				},

				find: async () => {
					const waitForElementOptions = options?.waitForElementOptions;

					const result = await waitFor(() => {
						const iterResult = baseElement.querySelectorAll(selector);

						if (iterResult.length === 0) {
							throw new Error(
								`[react-integration-test-engine] there is no matched elements for the selector "${selector}"`,
							);
						}

						if (iterResult.length > 1) {
							throw new Error(
								`[react-integration-test-engine] there is no matched elements for the selector "${selector}"`,
							);
						}

						return iterResult[0] as HTMLElement;
					}, waitForElementOptions);

					return result;
				},
			};
		}

		default:
			throw new Error("[react-integration-test-engine] unknown query");
	}
}
