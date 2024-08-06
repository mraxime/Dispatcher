/** Common `server action` success response to use throughout the project. */
export type SubmitResponseSuccess<T extends Record<string, unknown>> = void | {
	success: true;
	data: T;
	errors?: never;
};

/** Common `server action` failed response to use throughout the project. */
export type SubmitResponseError = void | {
	success: false;
	data?: never;
	error: string;
};

/** Common `server action` response to use throughout the project. */
export type SubmitResponse<T extends Record<string, unknown> = Record<string, unknown>> =
	| SubmitResponseSuccess<T>
	| SubmitResponseError;

/** Common `server action` type to use throughout the project. */
export type ServerAction<T extends Record<string, unknown> = Record<string, unknown>> = (
	data: unknown,
) => Promise<SubmitResponse<T>>;

/** Generic client `onSubmit` function type. */
export type OnSubmit<T extends Record<string, unknown>> = (
	formValues: T,
) => ReturnType<ServerAction<T>>;
