import { Button } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { FC } from 'react';

import { Blade, Icon } from '@shared/components';

import { RequestDetailBladeProps } from './RequestDetailBlade.types';

const RequestDetailBlade: FC<RequestDetailBladeProps> = ({
	isOpen,
	roomData,
	type,
	onClose,
	onConfirm,
}) => {
	const { t } = useTranslation();

	const title = type === 'planned' ? t('Detail gepland bezoek') : t('Detail aanvraag');
	const buttonConfirmLabel = type === 'planned' ? t('Annuleer bezoek') : t('Annuleer aanvraag');

	const renderFooter = () => (
		<div className="u-px-32 u-py-16">
			<Button
				className="u-mb-24"
				iconStart={<Icon name="forbidden" />}
				label={buttonConfirmLabel}
				variants={['block', 'outline']}
				onClick={onConfirm}
			/>
			<Button label={t('Sluit')} variants={['block', 'text']} onClick={onClose} />
		</div>
	);

	return (
		<Blade footer={renderFooter()} isOpen={isOpen} title={title} onClose={onClose}>
			<div className="u-px-32">
				{/* TODO: move image and logo combo to separate component */}
				<div className="u-flex">
					<div>
						{roomData?.image && (
							<div className={''}>
								<Image
									src={roomData?.image}
									alt={roomData?.name || roomData?.id.toString()}
									layout="fill"
									objectFit="cover"
								/>
							</div>
						)}

						{roomData?.logo && (
							<div className={''}>
								<Image
									className={''}
									src={roomData?.logo || ''}
									alt={roomData?.name || roomData?.id.toString()}
									layout="fill"
									objectFit="contain"
								/>
							</div>
						)}
					</div>
					<p>
						<strong>{roomData?.name}</strong>
					</p>
				</div>
				<p className="u-color-neutral u-mt-24 u-mb-32">
					Op de dag van je bezoek, kan je aan balie B terecht om de leeszaal te betreden.
				</p>
				<section className="u-mb-24">
					<strong>{t('Reden van aanvraag')}</strong>
					<p className="u-color-neutral u-mt-8">Persoonlijk onderzoek thesis</p>
				</section>
				<section className="u-mb-24">
					<strong>{t('Wanneer wil je de leeszaal bezoeken? (optioneel)')}</strong>
					<p className="u-color-neutral u-mt-8">Persoonlijk onderzoek thesis</p>
				</section>
			</div>
		</Blade>
	);
};

export default RequestDetailBlade;
