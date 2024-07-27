type Validator<T> = (value: unknown) => value is T;
function isTypeOfUndefined<T>(value: T | undefined): value is undefined {
	return typeof value === 'undefined';
}

export { Validator, isTypeOfUndefined };
