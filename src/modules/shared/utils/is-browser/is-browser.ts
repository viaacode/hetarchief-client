export const isServerSideRendering = (): boolean => {
	return typeof window === 'undefined';
};

export const isBrowser = (): boolean => {
	return !isServerSideRendering();
};
