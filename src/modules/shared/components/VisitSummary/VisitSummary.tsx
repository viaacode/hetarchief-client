import type { FC } from 'react';

import type { VisitSummaryProps } from '@shared/components/VisitSummary';
import { tHtml } from '@shared/helpers/translate';

import SpacePreview from '../SpacePreview/SpacePreview';

import clsx from 'clsx';
import styles from './VisitSummary.module.scss';

const VisitSummary: FC<VisitSummaryProps> = ({
	visitorName,
	reason,
	timeframe,
	spaceId,
	spaceImage,
	spaceLogo,
	spaceName,
	spaceColor,
	spaceServiceDescriptionNl,
	spaceServiceDescriptionEn,
	preview = false,
}) => {
	return (
		<div className={clsx(styles['c-visit-summary'], 'u-px-32 u-px-20-md')}>
			{preview && (
				<SpacePreview
					visitorSpace={{
						id: spaceId,
						image: spaceImage || '',
						logo: spaceLogo || '',
						name: spaceName || '',
						color: spaceColor || '',
						serviceDescriptionNl: spaceServiceDescriptionNl || '',
						serviceDescriptionEn: spaceServiceDescriptionEn || '',
					}}
				/>
			)}

			{visitorName && (
				<>
					<strong>
						{tHtml('modules/cp/components/process-request-blade/process-request-blade___aanvrager')}
					</strong>
					<p>{visitorName}</p>
				</>
			)}

			{reason && (
				<>
					<strong>
						{tHtml(
							'modules/cp/components/process-request-blade/process-request-blade___reden-van-aanvraag'
						)}
					</strong>
					<p>{reason}</p>
				</>
			)}

			{timeframe && (
				<>
					<strong>
						{tHtml(
							'modules/cp/components/process-request-blade/process-request-blade___wanneer-wil-je-de-bezoekersruimte-bezoeken'
						)}
					</strong>
					<p>{timeframe}</p>
				</>
			)}
		</div>
	);
};

export default VisitSummary;
