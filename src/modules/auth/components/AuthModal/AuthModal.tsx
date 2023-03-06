import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { FC } from 'react';

import { AuthModalProps } from '@auth/components';
import { AuthService } from '@auth/services/auth-service';
import { Icon, IconNamesLight, Modal } from '@shared/components';
import Html from '@shared/components/Html/Html';
import { globalLabelKeys } from '@shared/const';
import useTranslation from '@shared/hooks/use-translation/use-translation';

import styles from './AuthModal.module.scss';

const AuthModal: FC<AuthModalProps> = (props) => {
	const { query } = useRouter();
	const { tHtml, tText } = useTranslation();
	const router = useRouter();
	const { publicRuntimeConfig } = getConfig();

	/**
	 * Methods
	 */

	const onLoginHetArchief = async () => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { showAuth, ...queryParams } = query;
		await AuthService.redirectToLoginHetArchief(queryParams, router);
	};

	const onRegisterHetArchief = async () => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { showAuth, ...queryParams } = query;
		await AuthService.redirectToRegisterHetArchief(queryParams, router);
	};

	const onLoginMeemoo = async () => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { showAuth, ...queryParams } = query;
		await AuthService.redirectToLoginMeemoo(queryParams, router);
	};

	/**
	 * Render
	 */

	const renderHeading = () => {
		return (
			<h3
				id={globalLabelKeys.modal.title}
				className={clsx(styles['c-auth-modal__heading'], 'u-text-center')}
			>
				{tHtml('modules/auth/components/auth-modal/auth-modal___inloggen-of-registreren')}
			</h3>
		);
	};

	const renderFooter = () => {
		if (publicRuntimeConfig.ENABLE_LOGIN_FOOTER === 'true') {
			return (
				<div className="u-text-center u-bg-silver">
					<Button
						label={tHtml(
							'modules/auth/components/auth-modal/auth-modal___meld-je-aan-als-admin'
						)}
						variants="text"
						onClick={onLoginMeemoo}
					/>
				</div>
			);
		}
	};

	return (
		<Modal {...props} heading={renderHeading()} footer={renderFooter()}>
			<div className={clsx(styles['c-auth-modal__content'], 'u-text-center', 'u-pt-24')}>
				<Html
					className="u-mb-24 u-mb-40:md u-font-size-14 u-color-neutral"
					content={tText(
						'modules/auth/components/auth-modal/auth-modal___klaar-om-een-bezoek-te-plannen-aan-een-van-de-bezoekersruimtes-log-dan-meteen-in-met-jouw-het-archief-account'
					)}
				/>

				<Button
					iconStart={<Icon className="u-text-left" name={IconNamesLight.LogIn} />}
					label={tHtml(
						'modules/auth/components/auth-modal/auth-modal___inloggen-met-het-archief-account'
					)}
					variants="black"
					onClick={onLoginHetArchief}
				/>

				<p className="u-mt-32 u-mb-16 u-font-size-14 u-color-neutral">
					{tHtml(
						'modules/auth/components/auth-modal/auth-modal___nog-geen-strong-gratis-strong-account-op-het-archief'
					)}
				</p>
				<Button
					className="u-mb-48"
					label={tHtml(
						'modules/auth/components/auth-modal/auth-modal___registreer-je-hier'
					)}
					variants="outline"
					onClick={onRegisterHetArchief}
				/>
			</div>
		</Modal>
	);
};

export default AuthModal;
