import { Badge } from '@meemoo/react-components';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import React, { FC } from 'react';

import { Icon } from '@shared/components';
import { VisitStatus } from '@shared/types';

import styles from './RequestStatusBadge.module.scss';
import { RequestStatusBadgeProps } from './RequestStatusBadge.types';

const RequestStatusBadge: FC<RequestStatusBadgeProps> = ({ className, style, status }) => {
	const { t } = useTranslation();

	const renderBadge = () => {
		switch (status) {
			case VisitStatus.PENDING:
				return t(
					'modules/cp/components/request-status-chip/request-status-chip___open-aanvraag'
				);

			case VisitStatus.APPROVED:
				return (
					<>
						<Badge type="success" text={<Icon name="check" />} variants="icon" />
						{t(
							'modules/cp/components/request-status-chip/request-status-chip___goedgekeurd'
						)}
					</>
				);

			case VisitStatus.DENIED:
				return (
					<>
						<Badge type="error" text={<Icon name="forbidden" />} variants="icon" />
						{t(
							'modules/cp/components/request-status-chip/request-status-chip___geweigerd'
						)}
					</>
				);

			case VisitStatus.CANCELLED_BY_VISITOR:
				return (
					<>
						<Badge type="error" text={<Icon name="trash" />} variants="icon" />
						{t(
							'modules/cp/components/request-status-badge/request-status-badge___geannuleerd'
						)}
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
