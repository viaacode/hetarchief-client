import { User } from '@auth/types';

type AcceptTermsOfService = User;

interface GetTermsOfService {
	updatedAt: string;
}

export type AcceptTermsOfServiceResponse = AcceptTermsOfService | undefined;
export type GetTermsOfServiceResponse = GetTermsOfService | undefined;
