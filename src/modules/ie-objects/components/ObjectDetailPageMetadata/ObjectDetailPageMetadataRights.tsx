import Metadata from '@ie-objects/components/Metadata/Metadata';
import { Button } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import type { ReactNode } from 'react';

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
	const renderLabel = (content: ReactNode) => {
		if (!labelUrl) {
			return content;
		}

		return (
			<a href={labelUrl} target="_blank" rel="noreferrer">
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
			<span className="u-flex u-flex-col u-gap-xs">
				<span className="u-flex u-flex-items-center u-gap-xs">
					{labelIcon && renderLabel(labelIcon)}
					{renderLabel(label)}
				</span>
				{copyrightHolder && copyrightHolderLabel && (
					<span>
						<strong>{copyrightHolderLabel}: </strong>
						{copyrightHolder}
					</span>
				)}
				{licenseDistributor && licenseDistributorLabel && (
					<span>
						<strong>{licenseDistributorLabel}: </strong>
						{licenseDistributor}
					</span>
				)}
			</span>
		</Metadata>
	);
}
