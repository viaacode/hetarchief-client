export interface CreateVisitRequest {
	spaceId: string;
	userProfileId: string;
	timeframe: string;
	reason: string;
	acceptedTos: boolean;
}
