import type { Schema, ValidationError } from 'yup';

/**
 * Validate form field values object against a joi schema
 * @param formValues
 * @param formSchema
 */
export async function validateForm(
	formValues: any,
	formSchema: Schema<any>
): Promise<null | Record<string, string>> {
	try {
		await formSchema.validate(formValues, {
			strict: true,
			abortEarly: false,
		});

		return null;
	} catch (err) {
		const validationError = err as ValidationError;
		return Object.fromEntries(
			validationError.inner.map((error) => {
				return [error.path, error.message];
			})
		);
	}
}
