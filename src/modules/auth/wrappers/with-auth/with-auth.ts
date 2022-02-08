import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { AuthMessage, authService } from '@auth/services/auth-service';
import { encodeShowAuth } from '@home/utils';

import { WithAuthProps, WithAuthReturn } from './with-auth.types';

export const withAuth = <P extends WithAuthProps = WithAuthProps>(
	gssp: GetServerSideProps<P>
): WithAuthReturn<P> => {
	return async (context: GetServerSidePropsContext) => {
		const response = await authService.checkLogin(
			{
				headers: {
					// Explicitly send cookie header because we are on the server
					Cookie: context.req.headers.cookie,
				},
			},
			true
		);

		if (!response?.userInfo || response.message === AuthMessage.LoggedOut) {
			return {
				redirect: {
					destination: `/?${encodeShowAuth(true)}`,
					permanent: false,
				},
			};
		}

		return gssp(context);
	};
};
