import { clamp } from 'lodash-es';

import { toSeconds } from './duration';

export function getValidStartAndEnd(
	start: number | null | undefined,
	end: number | null | undefined,
	duration: number | null | undefined
): [number | null, number | null] {
	const minTime = 0;
	const maxTime: number = duration || 0;

	const clampDuration = (duration: number): number => {
		return clamp(duration, minTime, maxTime);
	};
	const validStart = clampDuration(Math.min(start || 0, end || maxTime || start || 0));
	const validEnd = clampDuration(Math.max(start || 0, end || maxTime || start || 0));

	let startAndEndArray: [number | null, number | null];
	if (validStart === validEnd) {
		startAndEndArray = [0, duration || 0];
	} else {
		startAndEndArray = [validStart, validEnd];
	}

	if ((start === 0 && end === toSeconds(duration)) || (!start && !end)) {
		startAndEndArray = [null, null];
	}

	return startAndEndArray;
}
