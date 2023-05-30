export async function getTranslations(proxyUrl: string): Promise<Record<string, string>> {
	const TRANSLATIONS_URL = `${proxyUrl}/admin/translations/nl.json`;
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
