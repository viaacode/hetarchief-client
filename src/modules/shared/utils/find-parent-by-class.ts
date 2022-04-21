export const findParentByClass = (needle: string, el?: HTMLElement | null): false | HTMLElement => {
	if (!el) {
		return false;
	}

	if (el?.className.includes(needle)) {
		return el;
	}

	return findParentByClass(needle, el?.parentElement);
};
