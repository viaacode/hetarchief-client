import { getAccessToDate } from '@shared/components/ApproveRequestBlade/ApproveRequestBlade.helpers';
import { parseISO } from 'date-fns';
import { describe, expect, it } from 'vitest';

describe('getAccessToDate', () => {
	it('should return 18:00 for same day 09:00', () => {
		expect(
			getAccessToDate(new Date('2023-03-08T09:00:00'), new Date('2023-03-08T13:00:00'))
		).toEqual(null);
	});

	it('should return 18:30 for same day 17:31', () => {
		const accessToDate = getAccessToDate(
			parseISO('2023-03-08T17:31:00+00:00'),
			parseISO('2023-03-08T13:00:00+00:00')
		);
		const accessToIsoString = accessToDate?.toISOString();
		expect(accessToIsoString).toEqual('2023-03-08T18:45:00.000Z');
	});

	it('should return 21:30 for same day 20:29', () => {
		expect(
			getAccessToDate(
				parseISO('2023-03-08T17:31:00+00:00'),
				parseISO('2023-03-08T13:00:00+00:00')
			)?.toISOString()
		).toEqual('2023-03-08T18:45:00.000Z');
	});

	it('should return null for next date 13:00', () => {
		expect(
			getAccessToDate(parseISO('2023-03-08T17:31:00+00:00'), parseISO('2023-03-09T13:00:00+00:00'))
		).toEqual(null);
	});
});
