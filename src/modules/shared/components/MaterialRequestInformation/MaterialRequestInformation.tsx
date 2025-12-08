import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tHtml } from '@shared/helpers/translate';
import type { FC } from 'react';
import styles from './MaterialRequestInformation.module.scss';

const MaterialRequestInformation: FC = () => (
	<p className={styles['c-material-request-information']}>
		<Icon name={IconNamesLight.Info} aria-hidden />
		{tHtml('Meer informatie over aanvragen')}
	</p>
);

export default MaterialRequestInformation;
