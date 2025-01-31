export function convertDurationStringToSeconds(duration: string): number | null {
	try {
		const durationParts = duration.split(':').map((part) => Number.parseInt(part, 10));
		return durationParts[0] * 3600 + durationParts[1] * 60 + durationParts[2];
	} catch (err) {
		console.error({
			message: 'Failed to parse duration string in convertDurationStringToSeconds',
			innerException: err,
			additionalInfo: {
				duration,
			},
		});
		return null;
	}
}
