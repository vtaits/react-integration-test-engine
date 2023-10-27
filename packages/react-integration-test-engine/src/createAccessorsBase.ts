import { waitFor } from "@testing-library/react";
import {
	type AccessorParamsType,
	AccessorQueryType,
	type AccessorsType,
	type QueriesType,
} from "./types";

export function createAccessorsBase(
	getQs: () => QueriesType,
	getBaseElement: () => HTMLElement,
	params: AccessorParamsType,
): AccessorsType {
	switch (params.query) {
		case AccessorQueryType.Role:
			return {
				getAll: () => getQs().getAllByRole(...params.parameters),
				get: () => getQs().getByRole(...params.parameters),
				queryAll: () => getQs().queryAllByRole(...params.parameters),
				query: () => getQs().queryByRole(...params.parameters),
				findAll: () => getQs().findAllByRole(...params.parameters),
				find: () => getQs().findByRole(...params.parameters),
			};

		case AccessorQueryType.LabelText:
			return {
				getAll: () => getQs().getAllByLabelText(...params.parameters),
				get: () => getQs().getByLabelText(...params.parameters),
				queryAll: () => getQs().queryAllByLabelText(...params.parameters),
				query: () => getQs().queryByLabelText(...params.parameters),
				findAll: () => getQs().findAllByLabelText(...params.parameters),
				find: () => getQs().findByLabelText(...params.parameters),
			};

		case AccessorQueryType.PlaceholderText:
			return {
				getAll: () => getQs().getAllByPlaceholderText(...params.parameters),
				get: () => getQs().getByPlaceholderText(...params.parameters),
				queryAll: () => getQs().queryAllByPlaceholderText(...params.parameters),
				query: () => getQs().queryByPlaceholderText(...params.parameters),
				findAll: () => getQs().findAllByPlaceholderText(...params.parameters),
				find: () => getQs().findByPlaceholderText(...params.parameters),
			};

		case AccessorQueryType.Text:
			return {
				getAll: () => getQs().getAllByText(...params.parameters),
				get: () => getQs().getByText(...params.parameters),
				queryAll: () => getQs().queryAllByText(...params.parameters),
				query: () => getQs().queryByText(...params.parameters),
				findAll: () => getQs().findAllByText(...params.parameters),
				find: () => getQs().findByText(...params.parameters),
			};

		case AccessorQueryType.DisplayValue:
			return {
				getAll: () => getQs().getAllByDisplayValue(...params.parameters),
				get: () => getQs().getByDisplayValue(...params.parameters),
				queryAll: () => getQs().queryAllByDisplayValue(...params.parameters),
				query: () => getQs().queryByDisplayValue(...params.parameters),
				findAll: () => getQs().findAllByDisplayValue(...params.parameters),
				find: () => getQs().findByDisplayValue(...params.parameters),
			};

		case AccessorQueryType.AltText:
			return {
				getAll: () => getQs().getAllByAltText(...params.parameters),
				get: () => getQs().getByAltText(...params.parameters),
				queryAll: () => getQs().queryAllByAltText(...params.parameters),
				query: () => getQs().queryByAltText(...params.parameters),
				findAll: () => getQs().findAllByAltText(...params.parameters),
				find: () => getQs().findByAltText(...params.parameters),
			};

		case AccessorQueryType.Title:
			return {
				getAll: () => getQs().getAllByTitle(...params.parameters),
				get: () => getQs().getByTitle(...params.parameters),
				queryAll: () => getQs().queryAllByTitle(...params.parameters),
				query: () => getQs().queryByTitle(...params.parameters),
				findAll: () => getQs().findAllByTitle(...params.parameters),
				find: () => getQs().findByTitle(...params.parameters),
			};

		case AccessorQueryType.TestId:
			return {
				getAll: () => getQs().getAllByTestId(...params.parameters),
				get: () => getQs().getByTestId(...params.parameters),
				queryAll: () => getQs().queryAllByTestId(...params.parameters),
				query: () => getQs().queryByTestId(...params.parameters),
				findAll: () => getQs().findAllByTestId(...params.parameters),
				find: () => getQs().findByTestId(...params.parameters),
			};

		case AccessorQueryType.QuerySelector: {
			const [selector, options] = params.parameters;

			return {
				getAll: () => {
					const result = getBaseElement().querySelectorAll(selector);

					if (result.length === 0) {
						throw new Error(
							`[react-integration-test-engine] there are no matched elements for the selector "${selector}"`,
						);
					}

					return [...result] as HTMLElement[];
				},

				get: () => {
					const result = getBaseElement().querySelectorAll(selector);

					if (result.length === 0) {
						throw new Error(
							`[react-integration-test-engine] there are no matched elements for the selector "${selector}"`,
						);
					}

					if (result.length > 1) {
						throw new Error(
							`[react-integration-test-engine] there are multiple matched elements for the selector "${selector}"`,
						);
					}

					return result[0] as HTMLElement;
				},

				queryAll: () => {
					const result = getBaseElement().querySelectorAll(selector);

					return [...result] as HTMLElement[];
				},

				query: () => {
					const result = getBaseElement().querySelectorAll(selector);

					if (result.length === 0) {
						return null;
					}

					if (result.length > 1) {
						throw new Error(
							`[react-integration-test-engine] there are multiple matched elements for the selector "${selector}"`,
						);
					}

					return result[0] as HTMLElement;
				},

				findAll: async () => {
					const waitForElementOptions = options?.waitForElementOptions;

					const result = await waitFor(() => {
						const iterResult = getBaseElement().querySelectorAll(selector);

						if (iterResult.length === 0) {
							throw new Error(
								`[react-integration-test-engine] there are no matched elements for the selector "${selector}"`,
							);
						}

						return [...iterResult] as HTMLElement[];
					}, waitForElementOptions);

					return result;
				},

				find: async () => {
					const waitForElementOptions = options?.waitForElementOptions;

					const result = await waitFor(() => {
						const iterResult = getBaseElement().querySelectorAll(selector);

						if (iterResult.length === 0) {
							throw new Error(
								`[react-integration-test-engine] there are no matched elements for the selector "${selector}"`,
							);
						}

						if (iterResult.length > 1) {
							throw new Error(
								`[react-integration-test-engine] there are multiple matched elements for the selector "${selector}"`,
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
