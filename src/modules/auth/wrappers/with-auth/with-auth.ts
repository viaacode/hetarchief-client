import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { AuthMessage, AuthService } from '@auth/services/auth-service';
import { encodeShowAuth } from '@home/utils';

import { WithAuthProps, WithAuthReturn } from './with-auth.types';

export const withAuth = <P extends WithAuthProps = WithAuthProps>(
	gssp: GetServerSideProps<P>
): WithAuthReturn<P> => {
	return async (context: GetServerSidePropsContext) => {
		const response = await AuthService.checkLogin({
			headers: {
				// Explicitly send cookie header because we are on the server
				Cookie: context.req.headers.cookie,
			},
		});

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
