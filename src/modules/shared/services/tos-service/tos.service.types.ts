import { UserSchema } from '@auth/types';

type AcceptTermsOfService = UserSchema;

interface GetTermsOfService {
	updatedAt: string;
}

export type AcceptTermsOfServiceResponse = AcceptTermsOfService | undefined;
export type GetTermsOfServiceResponse = GetTermsOfService | undefined;
