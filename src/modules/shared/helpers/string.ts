export function capitalise(input?: string | string[]): string {
	return `${input}`.charAt(0).toUpperCase() + `${input}`.slice(1);
}
