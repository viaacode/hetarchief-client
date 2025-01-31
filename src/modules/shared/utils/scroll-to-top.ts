export function scrollTo(yLocation = 0, behavior: 'instant' | 'auto' | 'smooth' = 'smooth'): void {
	window.scrollTo({
		top: yLocation,
		left: 0,
		behavior: behavior as ScrollBehavior,
	});
}
