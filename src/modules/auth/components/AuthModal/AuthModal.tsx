import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { Trans, useTranslation } from 'next-i18next';
import { FC } from 'react';
import { useDispatch } from 'react-redux';

import { loginAction, setMockUser } from '@auth/store/user';
import { Icon, Modal } from '@shared/components';
import { setShowAuthModal } from '@shared/store/ui';

import styles from './AuthModal.module.scss';
import { AuthModalProps } from './AuthModal.types';

const AuthModal: FC<AuthModalProps> = (props) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();

	/**
	 * Methods
	 */

	const onLogin = () => {
		dispatch(loginAction());
	};

	/**
	 * Render
	 */

	const onMockLogin = () => {
		// TODO: replace with real login action
		dispatch(setMockUser({ firstName: 'Tom', lastName: 'Testerom' }));
		dispatch(setShowAuthModal(false));
	};

	const renderHeading = () => {
		return (
			<h3 className={clsx(styles['c-auth-modal__heading'], 'u-text-center')}>
				{t('modules/auth/components/auth-modal/auth-modal___inloggen-of-registreren')}
			</h3>
		);
	};

	const renderFooter = () => {
		return (
			<div className="u-text-center u-bg-platinum">
				<Button label={t('Meld je aan als admin')} variants="text" />
			</div>
		);
	};

	return (
		<Modal {...props} heading={renderHeading()} footer={renderFooter()}>
			<div className={clsx(styles['c-auth-modal__container'], 'u-text-center')}>
				<p className="u-mb-24 u-mb-32:md u-font-size-14 u-color-neutral">
					<Trans i18nKey="modules/auth/components/auth-modal/auth-modal___klaar-om-een-bezoek-te-plannen-aan-een-van-de-leeszalen-br-log-dan-meteen-in-met-jouw-het-archief-account">
						Klaar om een bezoek te plannen aan één van de leeszalen? <br /> Log dan
						meteen in met jouw Het Archief-account
					</Trans>
				</p>

				<Button
					iconStart={<Icon name="log-in" />}
					label={t(
						'modules/auth/components/auth-modal/auth-modal___inloggen-met-het-archief-account'
					)}
					variants="black"
					onClick={onLogin}
				/>

				<p className="u-mt-32 u-mb-16 u-font-size-14 u-color-neutral">
					<Trans i18nKey="modules/auth/components/auth-modal/auth-modal___nog-geen-strong-gratis-strong-account-op-het-archief">
						Nog geen <strong>gratis</strong> account op Het Archief?
					</Trans>
				</p>
				<Button
					className="u-mb-48"
					label={t('modules/auth/components/auth-modal/auth-modal___registreer-je-hier')}
					variants="outline"
				/>
			</div>
		</Modal>
	);
};

export default AuthModal;
