import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { AuthMessage, AuthService } from '@auth/services/auth-service';
import { encodeShowAuth } from '@home/utils';
import { ROUTES } from '@shared/const';
import { TosService } from '@shared/services/tos-service';
import { isCurrentTosAccepted } from '@shared/utils';

import { WithAuthProps, WithAuthReturn } from './with-auth.types';

export const withAuth = <P extends WithAuthProps = WithAuthProps>(
	gssp: GetServerSideProps<P>
): WithAuthReturn<P> => {
	return async (context: GetServerSidePropsContext) => {
		const permanent = false;
		const options = {
			headers: {
				// Explicitly send cookie header because we are on the server
				Cookie: context.req.headers.cookie,
			},
		};

		const login = await AuthService.checkLogin(options);
		const tos = await TosService.getTos(options);

		// Define destination for terms of service page
		const toTermsOfService = () => {
			return {
				redirect: {
					destination: `${ROUTES.termsOfService}?after=TODO`,
					permanent,
				},
			};
		};

		if (!login?.userInfo || login.message === AuthMessage.LoggedOut) {
			//
			// When the user isn't present in the response or the response states they've logged out

			return {
				redirect: {
					destination: `/?${encodeShowAuth(true)}`,
					permanent,
				},
			};
		} else if (!login.userInfo.acceptedTosAt) {
			//
			// When the user is present in the response, they've not logged out and they haven't accepted the TOS yet

			return toTermsOfService();
		} else if (tos) {
			//
			// When the user is present in the response, they've not logged out and they *have* accepted the TOS previously

			if (!isCurrentTosAccepted(login.userInfo.acceptedTosAt, tos.updatedAt)) {
				//
				// When the user accepted a previous version of the TOS

				return toTermsOfService();
			}
		}

		return gssp(context);
	};
};
