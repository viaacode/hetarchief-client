import { Visit } from '@shared/types';

export type VisitSummaryType = Pick<
	Visit,
	| 'spaceId'
	| 'spaceName'
	| 'spaceImage'
	| 'spaceLogo'
	| 'spaceColor'
	| 'visitorName'
	| 'reason'
	| 'timeframe'
>;
export type VisitSummaryProps = VisitSummaryType & { preview?: boolean };
