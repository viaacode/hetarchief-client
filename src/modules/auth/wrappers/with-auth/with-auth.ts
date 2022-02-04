import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { AuthMessage, authService } from '@auth/services/auth-service';

import { WithAuthProps, WithAuthReturn } from './with-auth.types';

export const withAuth = <P extends WithAuthProps = WithAuthProps>(
	gssp: GetServerSideProps<P>
): WithAuthReturn<P> => {
	return async (context: GetServerSidePropsContext) => {
		const response = await authService.checkLogin(process.env.PROXY_URL);
		console.log(response);

		if (!response?.userInfo || response.message === AuthMessage.LoggedOut) {
			return {
				redirect: {
					destination: '/?showAuthModal=1',
					permanent: false,
				},
			};
		}

		return gssp(context);
	};
};
