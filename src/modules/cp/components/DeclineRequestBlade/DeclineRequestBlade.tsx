import { useTranslation } from 'next-i18next';
import { FC } from 'react';

import { Blade } from '@shared/components';

import { ProcessRequestBladeProps } from '../ProcessRequestBlade';

const DeclineRequestBlade: FC<ProcessRequestBladeProps> = (props) => {
	const { t } = useTranslation();

	return <Blade {...props} title={t('Aanvraag afkeuren')} />;
};

export default DeclineRequestBlade;
