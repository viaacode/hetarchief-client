export interface Alert {
	id: string;
	title: string;
	message: string;
	type: string;
	userGroups: string[];
	fromDate: string;
	untilDate: string;
}
