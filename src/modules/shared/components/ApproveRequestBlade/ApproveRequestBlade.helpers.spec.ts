import {
	getAccessToDate,
	roundToNextQuarter,
} from '@shared/components/ApproveRequestBlade/ApproveRequestBlade.helpers';

describe('getAccessToDate', () => {
	it('should return 18:00 for same day 09:00', () => {
		expect(
			getAccessToDate(new Date('2023-03-08T09:00:00'), new Date('2023-03-08T13:00:00'))
		).toEqual(null);
	});

	it('should return 18:30 for same day 17:31', () => {
		expect(
			getAccessToDate(
				new Date('2023-03-08T17:31:00'),
				new Date('2023-03-08T13:00:00')
			)?.toISOString()
		).toEqual('2023-03-08T18:45:00.000Z');
	});

	it('should return 21:30 for same day 20:29', () => {
		expect(
			getAccessToDate(
				new Date('2023-03-08T17:31:00'),
				new Date('2023-03-08T13:00:00')
			)?.toISOString()
		).toEqual('2023-03-08T18:45:00.000Z');
	});

	it('should return null for next date 13:00', () => {
		expect(
			getAccessToDate(new Date('2023-03-08T17:31:00'), new Date('2023-03-09T13:00:00'))
		).toEqual(null);
	});

	it('should return 00:45 for next date 00:10', () => {
		expect(
			getAccessToDate(
				new Date('2023-03-08T23:40:00'),
				new Date('2023-03-09T00:10:00')
			)?.toISOString()
		).toEqual('2023-03-09T00:45:00.000Z');
	});

	it('should return 18:00 for same day 00:10 and end date in the past', () => {
		expect(
			getAccessToDate(
				new Date('2023-03-08T00:10:00'),
				new Date('2023-03-07T00:10:00')
			)?.toISOString()
		).toEqual('2023-03-08T18:00:00.000Z');
	});

	it('should return 18:00 for same day 00:10 and end date in the past but same day', () => {
		expect(
			getAccessToDate(
				new Date('2023-03-08T00:10:00'),
				new Date('2023-03-08T00:09:00')
			)?.toISOString()
		).toEqual('2023-03-08T18:00:00.000Z');
	});

	it('should return null for 16:00 and end date 20:45', () => {
		expect(
			getAccessToDate(new Date('2023-03-08T16:00:00'), new Date('2023-03-08T20:45:00'))
		).toEqual(null);
	});

	it('should return null for 16:00 and end date the next day', () => {
		expect(
			getAccessToDate(new Date('2023-03-08T16:00:00'), new Date('2023-03-09T00:45:00'))
		).toEqual(null);
	});
});

describe('roundToNextQuarter', () => {
	it('should return 01:00 for 01:00', () => {
		expect(roundToNextQuarter(new Date('2023-03-08T01:00:00'))?.toISOString()).toEqual(
			'2023-03-08T01:00:00.000Z'
		);
	});

	it('should return 01:00 for 00:40', () => {
		expect(roundToNextQuarter(new Date('2023-03-08T00:40:00'))?.toISOString()).toEqual(
			'2023-03-08T00:45:00.000Z'
		);
	});

	it('should return 01:15 for 01:01', () => {
		expect(roundToNextQuarter(new Date('2023-03-08T01:01:00'))?.toISOString()).toEqual(
			'2023-03-08T01:15:00.000Z'
		);
	});

	it('should return 01:15 for 01:15', () => {
		expect(roundToNextQuarter(new Date('2023-03-08T01:15:00'))?.toISOString()).toEqual(
			'2023-03-08T01:15:00.000Z'
		);
	});

	it('should return 01:15 for 01:07', () => {
		expect(roundToNextQuarter(new Date('2023-03-08T01:07:00'))?.toISOString()).toEqual(
			'2023-03-08T01:15:00.000Z'
		);
	});
});
