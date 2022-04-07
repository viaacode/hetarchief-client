import clsx from 'clsx';
import DOMPurify from 'dompurify';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';

import { RICH_TEXT_SANITIZATION } from '@shared/const';

import { CardImage } from '../CardImage';

import styles from './VisitSummary.module.scss';
import { VisitSummaryProps } from './VisitSummary.types';

const VisitSummary: FC<VisitSummaryProps> = ({
	visitorName,
	reason,
	timeframe,
	spaceId,
	spaceImage,
	spaceLogo,
	spaceName,
	spaceColor,
	spaceServiceDescription = '<b>banaan</b>',
	preview = false,
}) => {
	const { t } = useTranslation();

	const canPreview = spaceImage || spaceLogo || spaceName;

	return (
		<div className={styles['c-visit-summary']}>
			{preview && canPreview && (
				<div className={clsx(styles['c-visit-summary__preview'], 'u-mb-24')}>
					<CardImage
						id={spaceId}
						color={spaceColor}
						image={spaceImage}
						logo={spaceLogo}
					/>

					{spaceName && <strong className="u-px-12">{spaceName}</strong>}
				</div>
			)}

			{spaceServiceDescription && spaceServiceDescription.length > 0 && (
				<div
					className="u-mb-40"
					dangerouslySetInnerHTML={{
						__html: String(
							DOMPurify.sanitize(
								spaceServiceDescription, // rich-text content
								RICH_TEXT_SANITIZATION
							)
						),
					}}
				/>
			)}

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
