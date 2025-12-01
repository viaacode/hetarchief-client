/**
 * Converts a duration in the form: 00:00:00 to number of seconds
 * @param duration
 */

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

/**
 * Converts seconds or a duration string to seconds
 * 00:03:36 => 216
 *
 * @param duration
 * @param silent if this function should throw an error or instead return null if the format of the duration is invalid
 */
export function toSeconds(
	duration: number | string | undefined | null,
	silent = false
): number | null {
	if (!duration) {
		return 0;
	}
	if (typeof duration === 'number') {
		return duration;
	}

	const durationParts = duration.split(':');
	try {
		if (durationParts.length !== 3) {
			throw new Error(`Could not analyze time interval: "${duration}. Expected format: hh:mm:ss`);
		}
		return (
			parseInt(durationParts[0], 10) * 3600 +
			parseInt(durationParts[1], 10) * 60 +
			parseFloat(durationParts[2])
		);
	} catch (err) {
		if (silent) {
			return null;
		}
		throw new Error(
			JSON.stringify({
				message: `Could not analyze time interval: "${duration}. Expected format: hh:mm:ss`,
				additionalInfo: {
					err,
				},
			})
		);
	}
}
