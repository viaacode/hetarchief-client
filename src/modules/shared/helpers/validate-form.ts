import type { Schema, ValidationError } from 'yup';

type ValidationResult =
	| { errors: Record<string, string>; validFormValues: null }
	// biome-ignore lint/suspicious/noExplicitAny: todo use generics
	| { errors: null; validFormValues: any };

/**
 * Validate form field values object against a joi schema
 * @param formValues
 * @param formSchema
 */
export async function validateForm(
	// biome-ignore lint/suspicious/noExplicitAny: todo use generics
	formValues: any,
	// biome-ignore lint/suspicious/noExplicitAny: todo use generics
	formSchema: Schema<any>
): Promise<ValidationResult> {
	try {
		const validFormValues = await formSchema.validate(formValues, {
			strict: true,
			abortEarly: false,
		});

		return { errors: null, validFormValues };
	} catch (err) {
		const validationError = err as ValidationError;
		return {
			errors: Object.fromEntries(
				validationError.inner.map((error) => {
					return [error.path, error.message];
				})
			),
			validFormValues: null,
		};
	}
}
