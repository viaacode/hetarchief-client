import { Visit } from '@shared/types';

export type VisitSummaryType = Pick<
	Visit,
	| 'id'
	| 'spaceId'
	| 'spaceName'
	| 'spaceImage'
	| 'spaceLogo'
	| 'spaceColor'
	| 'spaceServiceDescription'
	| 'visitorName'
	| 'reason'
	| 'timeframe'
>;
export type VisitSummaryProps = VisitSummaryType & { preview?: boolean };
