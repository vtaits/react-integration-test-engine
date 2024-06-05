import { waitFor } from "@testing-library/dom";
import {
	type AccessorParamsType,
	AccessorQueryType,
	type AccessorsType,
	type QueriesType,
} from "./types";

export function createAccessorsBase(
	queryQs: <Required extends boolean>(
		required: Required,
	) => Required extends true ? QueriesType : QueriesType | null,
	queryBaseElement: <Required extends boolean>(
		required: Required,
	) => Required extends true ? HTMLElement : HTMLElement | null,
	params: AccessorParamsType,
): AccessorsType {
	switch (params.query) {
		case AccessorQueryType.Role:
			return {
				getAll: () => queryQs(true).getAllByRole(...params.parameters),
				get: () => queryQs(true).getByRole(...params.parameters),
				queryAll: () => {
					const qs = queryQs(false);

					if (!qs) {
						return [];
					}

					return qs.queryAllByRole(...params.parameters);
				},
				query: () => {
					const qs = queryQs(false);

					if (!qs) {
						return null;
					}

					return qs.queryByRole(...params.parameters);
				},
				findAll: async () => {
					const qs = await waitFor(() => queryQs(true));

					return qs.findAllByRole(...params.parameters);
				},
				find: async () => {
					const qs = await waitFor(() => queryQs(true));

					return qs.findByRole(...params.parameters);
				},
			};

		case AccessorQueryType.LabelText:
			return {
				getAll: () => queryQs(true).getAllByLabelText(...params.parameters),
				get: () => queryQs(true).getByLabelText(...params.parameters),
				queryAll: () => {
					const qs = queryQs(false);

					if (!qs) {
						return [];
					}

					return qs.queryAllByLabelText(...params.parameters);
				},
				query: () => {
					const qs = queryQs(false);

					if (!qs) {
						return null;
					}

					return qs.queryByLabelText(...params.parameters);
				},
				findAll: async () => {
					const qs = await waitFor(() => queryQs(true));

					return qs.findAllByLabelText(...params.parameters);
				},
				find: async () => {
					const qs = await waitFor(() => queryQs(true));

					return qs.findByLabelText(...params.parameters);
				},
			};

		case AccessorQueryType.PlaceholderText:
			return {
				getAll: () =>
					queryQs(true).getAllByPlaceholderText(...params.parameters),
				get: () => queryQs(true).getByPlaceholderText(...params.parameters),
				queryAll: () => {
					const qs = queryQs(false);

					if (!qs) {
						return [];
					}

					return qs.queryAllByPlaceholderText(...params.parameters);
				},
				query: () => {
					const qs = queryQs(false);

					if (!qs) {
						return null;
					}

					return qs.queryByPlaceholderText(...params.parameters);
				},
				findAll: async () => {
					const qs = await waitFor(() => queryQs(true));

					return qs.findAllByPlaceholderText(...params.parameters);
				},
				find: async () => {
					const qs = await waitFor(() => queryQs(true));

					return qs.findByPlaceholderText(...params.parameters);
				},
			};

		case AccessorQueryType.Text:
			return {
				getAll: () => queryQs(true).getAllByText(...params.parameters),
				get: () => queryQs(true).getByText(...params.parameters),
				queryAll: () => {
					const qs = queryQs(false);

					if (!qs) {
						return [];
					}

					return qs.queryAllByText(...params.parameters);
				},
				query: () => {
					const qs = queryQs(false);

					if (!qs) {
						return null;
					}

					return qs.queryByText(...params.parameters);
				},
				findAll: async () => {
					const qs = await waitFor(() => queryQs(true));

					return qs.findAllByText(...params.parameters);
				},
				find: async () => {
					const qs = await waitFor(() => queryQs(true));

					return qs.findByText(...params.parameters);
				},
			};

		case AccessorQueryType.DisplayValue:
			return {
				getAll: () => queryQs(true).getAllByDisplayValue(...params.parameters),
				get: () => queryQs(true).getByDisplayValue(...params.parameters),
				queryAll: () => {
					const qs = queryQs(false);

					if (!qs) {
						return [];
					}

					return qs.queryAllByDisplayValue(...params.parameters);
				},
				query: () => {
					const qs = queryQs(false);

					if (!qs) {
						return null;
					}

					return qs.queryByDisplayValue(...params.parameters);
				},
				findAll: async () => {
					const qs = await waitFor(() => queryQs(true));

					return qs.findAllByDisplayValue(...params.parameters);
				},
				find: async () => {
					const qs = await waitFor(() => queryQs(true));

					return qs.findByDisplayValue(...params.parameters);
				},
			};

		case AccessorQueryType.AltText:
			return {
				getAll: () => queryQs(true).getAllByAltText(...params.parameters),
				get: () => queryQs(true).getByAltText(...params.parameters),
				queryAll: () => {
					const qs = queryQs(false);

					if (!qs) {
						return [];
					}

					return qs.queryAllByAltText(...params.parameters);
				},
				query: () => {
					const qs = queryQs(false);

					if (!qs) {
						return null;
					}

					return qs.queryByAltText(...params.parameters);
				},
				findAll: async () => {
					const qs = await waitFor(() => queryQs(true));

					return qs.findAllByAltText(...params.parameters);
				},
				find: async () => {
					const qs = await waitFor(() => queryQs(true));

					return qs.findByAltText(...params.parameters);
				},
			};

		case AccessorQueryType.Title:
			return {
				getAll: () => queryQs(true).getAllByTitle(...params.parameters),
				get: () => queryQs(true).getByTitle(...params.parameters),
				queryAll: () => {
					const qs = queryQs(false);

					if (!qs) {
						return [];
					}

					return qs.queryAllByTitle(...params.parameters);
				},
				query: () => {
					const qs = queryQs(false);

					if (!qs) {
						return null;
					}

					return qs.queryByTitle(...params.parameters);
				},
				findAll: async () => {
					const qs = await waitFor(() => queryQs(true));

					return qs.findAllByTitle(...params.parameters);
				},
				find: async () => {
					const qs = await waitFor(() => queryQs(true));

					return qs.findByTitle(...params.parameters);
				},
			};

		case AccessorQueryType.TestId:
			return {
				getAll: () => queryQs(true).getAllByTestId(...params.parameters),
				get: () => queryQs(true).getByTestId(...params.parameters),
				queryAll: () => {
					const qs = queryQs(false);

					if (!qs) {
						return [];
					}

					return qs.queryAllByTestId(...params.parameters);
				},
				query: () => {
					const qs = queryQs(false);

					if (!qs) {
						return null;
					}

					return qs.queryByTestId(...params.parameters);
				},
				findAll: async () => {
					const qs = await waitFor(() => queryQs(true));

					return qs.findAllByTestId(...params.parameters);
				},
				find: async () => {
					const qs = await waitFor(() => queryQs(true));

					return qs.findByTestId(...params.parameters);
				},
			};

		case AccessorQueryType.QuerySelector: {
			const [selector, options] = params.parameters;

			return {
				getAll: () => {
					const result = queryBaseElement(true).querySelectorAll(selector);

					if (result.length === 0) {
						throw new Error(
							`[react-integration-test-engine] there are no matched elements for the selector "${selector}"`,
						);
					}

					return [...result] as HTMLElement[];
				},

				get: () => {
					const result = queryBaseElement(true).querySelectorAll(selector);

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
					const baseElement = queryBaseElement(false);

					if (!baseElement) {
						return [];
					}

					const result = baseElement.querySelectorAll(selector);

					return [...result] as HTMLElement[];
				},

				query: () => {
					const baseElement = queryBaseElement(false);

					if (!baseElement) {
						return null;
					}

					const result = baseElement.querySelectorAll(selector);

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
						const iterResult =
							queryBaseElement(true).querySelectorAll(selector);

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
						const iterResult =
							queryBaseElement(true).querySelectorAll(selector);

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
