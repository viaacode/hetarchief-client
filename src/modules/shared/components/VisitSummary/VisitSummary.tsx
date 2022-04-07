import { useTranslation } from 'next-i18next';
import { FC } from 'react';

import styles from './VisitSummary.module.scss';
import { VisitSummaryProps } from './VisitSummary.types';

const VisitSummary: FC<VisitSummaryProps> = ({
	visitorName,
	reason,
	timeframe,
	spaceImage,
	spaceLogo,
	spaceName,
	spaceColor,
	preview = false,
}) => {
	const { t } = useTranslation();

	const canPreview = spaceImage || spaceLogo || spaceName;

	return (
		<div className={styles['c-visit-summary']}>
			{preview && canPreview && 'preview'}

			{visitorName && (
				<>
					<strong>
						{t(
							'modules/cp/components/process-request-blade/process-request-blade___aanvrager'
						)}
					</strong>
					<p>{visitorName}</p>
				</>
			)}

			{reason && (
				<>
					<strong>
						{t(
							'modules/cp/components/process-request-blade/process-request-blade___reden-van-aanvraag'
						)}
					</strong>
					<p>{reason}</p>
				</>
			)}

			{timeframe && (
				<>
					<strong>
						{t(
							'modules/cp/components/process-request-blade/process-request-blade___wanneer-wil-je-de-leeszaal-bezoeken'
						)}
					</strong>
					<p>{timeframe}</p>
				</>
			)}
		</div>
	);
};

export default VisitSummary;
