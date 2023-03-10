import { MaterialRequestRequesterCapacity } from '@material-requests/types';

export interface PersonalInfoType {
	fullName: string;
	email: string;
	organisation?: string;
	requesterCapacity: MaterialRequestRequesterCapacity;
}
