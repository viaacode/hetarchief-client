export function formatDateTime(date: Date): string {
	return date.toLocaleString('nl-BE', {
		dateStyle: 'medium',
		timeStyle: 'short',
	});
}
