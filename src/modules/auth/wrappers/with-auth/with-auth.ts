import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { WithAuthProps, WithAuthReturn } from './with-auth.types';

export const withAuth = <P extends WithAuthProps = WithAuthProps>(
	gssp: GetServerSideProps<P>
): WithAuthReturn<P> => {
	return async (context: GetServerSidePropsContext) => {
		// Check if user is logged in or not with check-login call
		const isLoggedIn = false;

		if (!isLoggedIn) {
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
