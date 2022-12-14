const TRANSLATIONS_URL = `${process.env.PROXY_URL}/admin/translations/nl.json`;

export async function getTranslations(): Promise<Record<string, string>> {
	try {
		const response = await fetch(TRANSLATIONS_URL);
		return response.json();
	} catch (err) {
		console.error({
			message: 'Failed to fetch translations from the backend',
			innerException: err,
			additionalInfo: TRANSLATIONS_URL,
		});
		return {};
	}
}
