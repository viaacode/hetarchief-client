export const getNearestFutureQuarter = (date?: Date | null): Date => {
	const now = new Date();
	const ms = 1000 * 60 * 15;
	let value = now;

	// Assumes only dates in the future (handled by Datepicker) will be passed in
	if (date && now.toDateString() !== date.toDateString()) {
		value = new Date(new Date(date).setHours(0, 0, 0, 0));
	}

	return new Date(Math.ceil(value.getTime() / ms) * ms);
};

export const getEndOfDay = (date?: Date | null): Date => {
	return new Date(new Date(date || new Date()).setHours(23, 59, 59, 999));
};
