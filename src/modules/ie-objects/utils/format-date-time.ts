export function formatDateTime(
	date: Date,
	dateStyle: 'medium' | 'short' = 'medium',
	showTime = true
): string {
	const formattedDateTime = date.toLocaleString('nl-BE', {
		dateStyle: dateStyle,
		...(showTime ? { timeStyle: 'short' } : {}),
	});

	return dateStyle === 'short' ? formattedDateTime.replace(/\//g, '-') : formattedDateTime;
}
