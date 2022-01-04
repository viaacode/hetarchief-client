export function formatDate(date: Date): string {
	return date.toLocaleDateString('nl-BE', {
		dateStyle: 'medium',
	});
}
