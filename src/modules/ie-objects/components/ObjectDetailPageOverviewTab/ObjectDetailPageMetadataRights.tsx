import Metadata from '@ie-objects/components/Metadata/Metadata';
import { Button } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import type { ReactNode } from 'react';

import styles from './ObjectDetailPageMetadataRights.module.scss';

export interface ObjectDetailPageMetadataRightsProps {
	title: ReactNode;
	className?: string;
	moreInfoUrl?: string;
	moreInfoTitle: string;
	label: ReactNode;
	labelUrl?: string;
	labelIcon?: ReactNode;
	copyrightHolder?: string;
	copyrightHolderLabel?: string;
	licenseDistributor?: string;
	licenseDistributorLabel?: string;
}

export function ObjectDetailPageMetadataRights({
	title,
	className,
	moreInfoUrl,
	moreInfoTitle,
	label,
	labelUrl,
	labelIcon,
	copyrightHolder,
	copyrightHolderLabel,
	licenseDistributor,
	licenseDistributorLabel,
}: ObjectDetailPageMetadataRightsProps) {
	const renderLabel = (content: ReactNode, className?: string, linkedClassName?: string) => {
		if (!labelUrl) {
			return <span className={className}>{content}</span>;
		}

		const linkClassName = [className, linkedClassName].filter(Boolean).join(' ');

		return (
			<a href={labelUrl} target="_blank" rel="noreferrer" className={linkClassName}>
				{content}
			</a>
		);
	};

	return (
		<Metadata
			title={title}
			className={className}
			key="metadata-rights-status"
			renderRight={
				moreInfoUrl ? (
					<a target="_blank" href={moreInfoUrl} rel="noreferrer">
						<Button
							variants={['white']}
							icon={<Icon name={IconNamesLight.Extern} aria-hidden />}
							title={moreInfoTitle}
						/>
					</a>
				) : null
			}
		>
			<span className={styles['c-object-detail-page-metadata-rights__content']}>
				<span className={styles['c-object-detail-page-metadata-rights__label']}>
					{labelIcon &&
						renderLabel(labelIcon, styles['c-object-detail-page-metadata-rights__label-icon'])}
					{renderLabel(
						label,
						styles['c-object-detail-page-metadata-rights__label-text'],
						styles['c-object-detail-page-metadata-rights__label-text--link']
					)}
				</span>
				{copyrightHolder && copyrightHolderLabel && (
					<span className={styles['c-object-detail-page-metadata-rights__metadata-item']}>
						<strong>{copyrightHolderLabel}</strong>
						<span>{copyrightHolder}</span>
					</span>
				)}
				{licenseDistributor && licenseDistributorLabel && (
					<span className={styles['c-object-detail-page-metadata-rights__metadata-item']}>
						<strong>{licenseDistributorLabel}</strong>
						<span>{licenseDistributor}</span>
					</span>
				)}
			</span>
		</Metadata>
	);
}
