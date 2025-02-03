import type { VisitRequest } from '@shared/types/visit-request';

export type VisitSummaryType = Pick<
	VisitRequest,
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
