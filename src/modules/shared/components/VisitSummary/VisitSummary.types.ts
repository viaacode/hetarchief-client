import { type Visit } from '@shared/types/visit';

export type VisitSummaryType = Pick<
	Visit,
	| 'id'
	| 'spaceId'
	| 'spaceName'
	| 'spaceImage'
	| 'spaceLogo'
	| 'spaceColor'
	| 'spaceServiceDescriptionNl'
	| 'spaceServiceDescriptionEn'
	| 'visitorName'
	| 'reason'
	| 'timeframe'
>;
export type VisitSummaryProps = VisitSummaryType & { preview?: boolean };
