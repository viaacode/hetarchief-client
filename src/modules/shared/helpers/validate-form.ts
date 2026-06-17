import type { Schema, ValidationError } from 'yup';

/**
 * Validate a form field values object against a yup schema
 * @param formValues
 * @param formSchema
 */
export async function validateForm(
	// biome-ignore lint/suspicious/noExplicitAny: todo use generics
	formValues: any,
	// biome-ignore lint/suspicious/noExplicitAny: todo use generics
	formSchema: Schema<any>
): Promise<Record<string, string> | null> {
	try {
		await formSchema.validate(formValues, {
			strict: true,
			abortEarly: false,
		});

		return null;
	} catch (err) {
		const validationError = err as ValidationError;
		if (!validationError.inner) {
			console.error(err);
			return null;
		}
		return Object.fromEntries(
			validationError.inner.map((error) => {
				return [error.path, error.message];
			})
		);
	}
}
