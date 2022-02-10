import { useTranslation } from 'next-i18next';
import { FC } from 'react';

import { Blade } from '@shared/components';

import { ProcessRequestBladeProps } from '../ProcessRequestBlade';

const ApproveRequestBlade: FC<ProcessRequestBladeProps> = (props) => {
	const { t } = useTranslation();

	return <Blade {...props} title={t('Aanvraag goedkeuren')} />;
};

export default ApproveRequestBlade;
