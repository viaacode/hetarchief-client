export function scrollTo(yLocation = 0): void {
	window.scrollTo({ top: yLocation, left: 0, behavior: 'smooth' });
}
