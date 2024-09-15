import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import Image from 'next/legacy/image';
import React, { type FC } from 'react';

import { GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE } from '@material-requests/const';
import {
	GET_MATERIAL_REQUEST_REQUESTER_CAPACITY_RECORD,
	type MaterialRequestDetail,
} from '@material-requests/types';
import { Blade } from '@shared/components/Blade/Blade';
import { Icon } from '@shared/components/Icon';
import { TYPE_TO_ICON_MAP } from '@shared/components/MediaCard';
import { tText } from '@shared/helpers/translate';
import { IeObjectType } from '@shared/types/ie-objects';
import { formatMediumDate } from '@shared/utils/dates';

import styles from './MaterialRequestDetailBlade.module.scss';

interface MaterialRequestDetailBladeProps {
	isOpen: boolean;
	onClose: () => void;
	currentMaterialRequestDetail?: MaterialRequestDetail;
}

const MaterialRequestDetailBlade: FC<MaterialRequestDetailBladeProps> = ({
	isOpen,
	onClose,
	currentMaterialRequestDetail,
}) => {
	const renderFooter = () => {
		return (
			<div className={styles['p-account-my-material-requests__close-button-container']}>
				<Button
					label={tText(
						'modules/account/components/material-request-detail-blade/material-requests___sluit'
					)}
					variants={['block', 'text']}
					onClick={onClose}
					className={styles['p-account-my-material-requests__close-button']}
				/>
			</div>
		);
	};

	return (
		<Blade
			isOpen={isOpen}
			renderTitle={(props: Pick<HTMLElement, 'id' | 'className'>) => (
				<h2
					{...props}
					className={clsx(
						props.className,
						styles['p-account-my-material-requests__title']
					)}
				>
					{tText(
						'modules/account/components/material-request-detail-blade/material-requests___detail'
					)}
				</h2>
			)}
			footer={isOpen && renderFooter()}
			onClose={onClose}
			id="material-request-detail-blade"
		>
			<div className={styles['p-account-my-material-requests__maintainer']}>
				{currentMaterialRequestDetail?.maintainerLogo && (
					<div className={styles['p-account-my-material-requests__maintainer-logo']}>
						<Image
							alt="maintainer logo"
							src={currentMaterialRequestDetail.maintainerLogo}
							layout="fill"
							objectFit="contain"
						/>
					</div>
				)}
				<div>
					<p className={styles['p-account-my-material-requests__maintainer-details']}>
						{tText(
							'modules/account/components/material-request-detail-blade/material-requests___aangevraagd'
						)}
					</p>
					<p className={styles['p-account-my-material-requests__maintainer-details']}>
						{currentMaterialRequestDetail?.maintainerName}
					</p>
				</div>
			</div>
			<a
				tabIndex={-1}
				href={`/zoeken/${currentMaterialRequestDetail?.maintainerSlug}/${currentMaterialRequestDetail?.objectSchemaIdentifier}`}
				className={styles['p-account-my-material-requests__material-link']}
			>
				<div className={styles['p-account-my-material-requests__material']} tabIndex={0}>
					<p className={styles['p-account-my-material-requests__material-label']}>
						<Icon
							className={
								styles['p-account-my-material-requests__material-label-icon']
							}
							name={
								TYPE_TO_ICON_MAP[
									currentMaterialRequestDetail?.objectDctermsFormat ||
										IeObjectType.Video
								]
							}
						/>
						<span>{currentMaterialRequestDetail?.objectSchemaName}</span>
					</p>
					<p className={styles['p-account-my-material-requests__material-id']}>
						{currentMaterialRequestDetail?.objectSchemaIdentifier}
					</p>
				</div>
			</a>
			<div className={styles['p-account-my-material-requests__content']}>
				<dl>
					{currentMaterialRequestDetail?.requesterFullName && (
						<>
							<dt className={styles['p-account-my-material-requests__content-label']}>
								{tText(
									'modules/account/components/material-request-detail-blade/material-requests___naam'
								)}
							</dt>
							<dd className={styles['p-account-my-material-requests__content-value']}>
								{currentMaterialRequestDetail.requesterFullName}
							</dd>
						</>
					)}
					{currentMaterialRequestDetail?.requesterMail && (
						<>
							<dt className={styles['p-account-my-material-requests__content-label']}>
								{tText(
									'modules/account/components/material-request-detail-blade/material-requests___emailadres'
								)}
							</dt>
							<dd className={styles['p-account-my-material-requests__content-value']}>
								{currentMaterialRequestDetail.requesterMail}
							</dd>
						</>
					)}
					{currentMaterialRequestDetail?.requesterCapacity && (
						<>
							<dt className={styles['p-account-my-material-requests__content-label']}>
								{tText(
									'modules/account/components/material-request-detail-blade/material-requests___hoedanigheid'
								)}
							</dt>
							<dd className={styles['p-account-my-material-requests__content-value']}>
								{
									GET_MATERIAL_REQUEST_REQUESTER_CAPACITY_RECORD()[
										currentMaterialRequestDetail.requesterCapacity
									]
								}
							</dd>
						</>
					)}
					{currentMaterialRequestDetail?.organisation ? (
						<>
							<dt className={styles['p-account-my-material-requests__content-label']}>
								{tText(
									'modules/account/components/material-request-detail-blade/material-requests___organisatie'
								)}
							</dt>
							<dd className={styles['p-account-my-material-requests__content-value']}>
								{currentMaterialRequestDetail.organisation}
							</dd>
						</>
					) : (
						<>
							<dt className={styles['p-account-my-material-requests__content-label']}>
								{tText(
									'modules/account/components/material-request-detail-blade/material-requests___organisatie'
								)}
							</dt>
							<dd className={styles['p-account-my-material-requests__content-value']}>
								{tText(
									'modules/account/components/material-request-detail-blade/material-requests___onbepaald'
								)}
							</dd>
						</>
					)}
					{currentMaterialRequestDetail?.reason && (
						<>
							<dt className={styles['p-account-my-material-requests__content-label']}>
								{tText(
									'modules/account/components/material-request-detail-blade/material-requests___reden'
								)}
							</dt>
							<dd className={styles['p-account-my-material-requests__content-value']}>
								{currentMaterialRequestDetail.reason}
							</dd>
						</>
					)}
					{currentMaterialRequestDetail?.createdAt && (
						<>
							<dt className={styles['p-account-my-material-requests__content-label']}>
								{tText(
									'modules/account/components/material-request-detail-blade/material-requests___datum'
								)}
							</dt>
							<dd className={styles['p-account-my-material-requests__content-value']}>
								{formatMediumDate(new Date(currentMaterialRequestDetail.createdAt))}
							</dd>
						</>
					)}
					{currentMaterialRequestDetail?.type && (
						<>
							<dt className={styles['p-account-my-material-requests__content-label']}>
								{tText(
									'modules/account/components/material-request-detail-blade/material-requests___type-aanvraag'
								)}
							</dt>
							<dd className={styles['p-account-my-material-requests__content-value']}>
								{
									GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE()[
										currentMaterialRequestDetail.type
									]
								}
							</dd>
						</>
					)}
				</dl>
			</div>
		</Blade>
	);
};

export default MaterialRequestDetailBlade;
