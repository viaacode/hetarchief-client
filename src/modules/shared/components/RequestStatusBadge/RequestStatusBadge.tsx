import { Badge } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tHtml } from '@shared/helpers/translate';
import { VisitStatus } from '@shared/types/visit-request';
import clsx from 'clsx';
import React, { type FC } from 'react';

import styles from './RequestStatusBadge.module.scss';
import type { RequestStatusBadgeProps } from './RequestStatusBadge.types';

const RequestStatusBadge: FC<RequestStatusBadgeProps> = ({ className, style, status }) => {
	const renderBadge = () => {
		switch (status) {
			case VisitStatus.PENDING:
				return tHtml(
					'modules/cp/components/request-status-chip/request-status-chip___open-aanvraag'
				);

			case VisitStatus.APPROVED:
				return (
					<>
						<Badge
							type="success"
							text={<Icon name={IconNamesLight.Check} aria-hidden />}
							variants="icon"
						/>
						{tHtml('modules/cp/components/request-status-chip/request-status-chip___goedgekeurd')}
					</>
				);

			case VisitStatus.DENIED:
				return (
					<>
						<Badge
							type="error"
							text={<Icon name={IconNamesLight.Forbidden} aria-hidden />}
							variants="icon"
						/>
						{tHtml('modules/cp/components/request-status-chip/request-status-chip___geweigerd')}
					</>
				);

			case VisitStatus.CANCELLED_BY_VISITOR:
				return (
					<>
						<Badge
							type="error"
							text={<Icon name={IconNamesLight.Trash} aria-hidden />}
							variants="icon"
						/>
						{tHtml('modules/cp/components/request-status-badge/request-status-badge___geannuleerd')}
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
