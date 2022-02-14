import { Badge } from '@meemoo/react-components';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import React, { FC } from 'react';

import { RequestStatus } from '@cp/const/requests.const';
import { Icon } from '@shared/components';

import styles from './RequestStatusBadge.module.scss';
import { RequestStatusBadgeProps } from './RequestStatusBadge.types';

const RequestStatusBadge: FC<RequestStatusBadgeProps> = ({ className, style, status }) => {
	const { t } = useTranslation();

	const renderBadge = () => {
		switch (status) {
			case RequestStatus.open:
				return t('Open aanvraag');

			case RequestStatus.approved:
				return (
					<>
						<Badge type="success" text={<Icon name="check" />} variants="icon" />
						{t('Goedgekeurd')}
					</>
				);

			case RequestStatus.denied:
				return (
					<>
						<Badge type="error" text={<Icon name="forbidden" />} variants="icon" />
						{t('Geweigerd')}
					</>
				);

			default:
				return null;
		}
	};

	return (
		<div className={clsx(className, styles['c-request-status-badge'])} style={style}>
			{renderBadge()}
		</div>
	);
};

export default RequestStatusBadge;
