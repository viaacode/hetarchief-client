import { Button } from '@meemoo/react-components';
import Image from 'next/image';
import { FC } from 'react';

import { Blade, Icon, IconNamesLight } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { formatMediumDate } from '@shared/utils';

import { MaterialRequestDetails } from '@material-requests/types';

interface MaterialRequestDetailBladeProps {
	isOpen: boolean;
	onClose: () => void;
	currentMaterialRequestDetails?: MaterialRequestDetails;
}

const MaterialRequestDetailBlade: FC<MaterialRequestDetailBladeProps> = ({
	isOpen,
	onClose,
	currentMaterialRequestDetails,
}) => {
	const { tText } = useTranslation();

	const renderFooter = () => {
		return (
			<div className="p-account-my-material-requests__close-button-container">
				<Button
					label={tText('modules/cp/const/material-requests___sluit')}
					variants={['block', 'text']}
					onClick={onClose}
					className="p-account-my-material-requests__close-button"
				/>
			</div>
		);
	};

	return (
		<Blade
			isOpen={isOpen}
			renderTitle={() => (
				<h2 className="p-account-my-material-requests__title">
					{tText('modules/cp/const/material-requests___detail')}
				</h2>
			)}
			footer={isOpen && renderFooter()}
			onClose={onClose}
		>
			<div className="p-account-my-material-requests__maintainer">
				{currentMaterialRequestDetails?.maintainerLogo && (
					<div className="p-account-my-material-requests__maintainer-logo">
						<Image
							alt="maintainer logo"
							src={currentMaterialRequestDetails?.maintainerLogo || ''}
							layout="fill"
							objectFit="contain"
						/>
					</div>
				)}
				<div>
					<p className="p-account-my-material-requests__maintainer-details">
						{tText('modules/cp/const/material-requests___aangevraagd')}
					</p>
					<p className="p-account-my-material-requests__maintainer-details">
						{currentMaterialRequestDetails?.maintainerName}
					</p>
				</div>
			</div>
			<a
				href={`/${currentMaterialRequestDetails?.maintainerSlug}/${currentMaterialRequestDetails?.objectSchemaIdentifier}`}
				className="p-account-my-material-requests__material-link"
			>
				<div className="p-account-my-material-requests__material">
					<p className="p-account-my-material-requests__material-label">
						<Icon
							className="p-account-my-material-requests__material-label-icon"
							// TODO: make icon dynamic when objectType is returned
							name={IconNamesLight.Video}
						/>
						{currentMaterialRequestDetails?.objectSchemaName}
					</p>
					<p className="p-account-my-material-requests__material-id">
						{currentMaterialRequestDetails?.objectSchemaIdentifier}
					</p>
				</div>
			</a>
			<div className="p-account-my-material-requests__content">
				{currentMaterialRequestDetails?.requesterFullName && (
					<>
						<p className="p-account-my-material-requests__content-label">
							{tText('modules/cp/const/material-requests___naam')}
						</p>
						<p className="p-account-my-material-requests__content-value">
							{currentMaterialRequestDetails.requesterFullName}
						</p>
					</>
				)}
				{currentMaterialRequestDetails?.requesterMail && (
					<>
						<p className="p-account-my-material-requests__content-label">
							{tText('modules/cp/const/material-requests___emailadres')}
						</p>
						<p className="p-account-my-material-requests__content-value">
							{currentMaterialRequestDetails.requesterMail}
						</p>
					</>
				)}
				{currentMaterialRequestDetails?.organisation && (
					<>
						<p className="p-account-my-material-requests__content-label">
							{tText('modules/cp/const/material-requests___organisatie')}
						</p>
						<p className="p-account-my-material-requests__content-value">
							{currentMaterialRequestDetails.organisation}
						</p>
					</>
				)}
				{currentMaterialRequestDetails?.reason && (
					<>
						<p className="p-account-my-material-requests__content-label">
							{tText('modules/cp/const/material-requests___reden')}
						</p>
						<p className="p-account-my-material-requests__content-value">
							{currentMaterialRequestDetails.reason}
						</p>
					</>
				)}
				{currentMaterialRequestDetails?.createdAt && (
					<>
						<p className="p-account-my-material-requests__content-label">
							{tText('modules/cp/const/material-requests___datum')}
						</p>
						<p className="p-account-my-material-requests__content-value">
							{formatMediumDate(new Date(currentMaterialRequestDetails.createdAt))}
						</p>
					</>
				)}
				{currentMaterialRequestDetails?.type && (
					<>
						<p className="p-account-my-material-requests__content-label">
							{tText('modules/cp/const/material-requests___type-aanvraag')}
						</p>
						<p className="p-account-my-material-requests__content-value">
							{currentMaterialRequestDetails.type}
						</p>
					</>
				)}
			</div>
		</Blade>
	);
};

export default MaterialRequestDetailBlade;
