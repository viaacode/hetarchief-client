import { Button, RadioButton, TextArea } from '@meemoo/react-components';
import clsx from 'clsx';
import Image from 'next/image';
import React, { FC, useState } from 'react';

import { Blade, Icon, IconNamesLight } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';

import styles from './MaterialRequestBlade.module.scss';

import { MaterialRequestType } from '@material-requests/types';

interface MaterialRequestBladeProps {
	isOpen: boolean;
	onClose: () => void;
	objectName: string;
	objectId: string;
	objectType: string;
	maintainerName: string;
	maintainerLogo: string;
	maintainerSlug: string;
}

const MaterialRequestBlade: FC<MaterialRequestBladeProps> = ({
	isOpen,
	onClose,
	objectName,
	objectId,
	objectType,
	maintainerName,
	maintainerLogo,
	maintainerSlug,
}) => {
	const { tText } = useTranslation();

	const [typeSelected, setTypeSelected] = useState<MaterialRequestType>(MaterialRequestType.VIEW);
	const [reasonInputValue, setReasonInputValue] = useState('');

	const renderFooter = () => {
		return (
			<div className={styles['c-request-material__footer-container']}>
				<Button
					label={tText(
						'modules/visitor-space/components/material-request-blade/material-request-blade___verstuur'
					)}
					variants={['block', 'text']}
					onClick={onClose}
					className={styles['c-request-material__verstuur-button']}
				/>
				<Button
					label={tText(
						'modules/visitor-space/components/material-request-blade/material-request-blade___voeg-toe-en-zoek'
					)}
					variants={['block', 'text']}
					onClick={onClose}
					className={styles['c-request-material__voeg-toe-button']}
				/>
				<Button
					label={tText(
						'modules/visitor-space/components/material-request-blade/material-request-blade___annuleer'
					)}
					variants={['block', 'text']}
					onClick={onClose}
					className={styles['c-request-material__annuleer-button']}
				/>
			</div>
		);
	};

	return (
		<Blade
			isOpen={isOpen}
			renderTitle={() => (
				<h2 className={styles['c-request-material__title']}>
					{tText(
						'modules/visitor-space/components/material-request-blade/material-request-blade___voeg-toe'
					)}
				</h2>
			)}
			footer={isOpen && renderFooter()}
			onClose={onClose}
		>
			<div className={styles['c-request-material__maintainer']}>
				{maintainerLogo && (
					<div className={styles['c-request-material__maintainer-logo']}>
						<Image
							alt="maintainer logo"
							src={maintainerLogo}
							layout="fill"
							objectFit="contain"
						/>
					</div>
				)}
				<div>
					<p className={styles['c-request-material__maintainer-details']}>
						{tText(
							'modules/visitor-space/components/material-request-blade/material-request-blade___item-van'
						)}
					</p>
					<p className={styles['c-request-material__maintainer-details']}>
						{maintainerName}
					</p>
				</div>
			</div>
			<a
				tabIndex={-1}
				href={`/${maintainerSlug}/${objectId}`}
				className={styles['c-request-material__material-link']}
			>
				<div className={styles['c-request-material__material']} tabIndex={0}>
					<p className={styles['c-request-material__material-label']}>
						<Icon
							className={styles['c-request-material__material-label-icon']}
							name={
								objectType === 'audio' ? IconNamesLight.Audio : IconNamesLight.Video
							}
						/>
						<span>{objectName}</span>
					</p>
					<p className={styles['c-request-material__material-id']}>{objectId}</p>
				</div>
			</a>
			<div className={styles['c-request-material__content']}>
				<dl>
					<>
						<dd
							className={clsx(
								styles['c-request-material__content-value'],
								styles['c-request-material__radio-buttons-container']
							)}
						>
							<RadioButton
								className={styles['c-request-material__radio-button']}
								label={tText(
									'modules/visitor-space/components/material-request-blade/material-request-blade___view'
								)}
								checked={typeSelected === MaterialRequestType.VIEW}
								onClick={() => setTypeSelected(MaterialRequestType.VIEW)}
							/>
							<RadioButton
								className={styles['c-request-material__radio-button']}
								label={tText(
									'modules/visitor-space/components/material-request-blade/material-request-blade___reuse'
								)}
								checked={typeSelected === MaterialRequestType.REUSE}
								onClick={() => setTypeSelected(MaterialRequestType.REUSE)}
							/>
							<RadioButton
								className={styles['c-request-material__radio-button']}
								label={tText(
									'modules/visitor-space/components/material-request-blade/material-request-blade___more-info'
								)}
								checked={typeSelected === MaterialRequestType.MORE_INFO}
								onClick={() => setTypeSelected(MaterialRequestType.MORE_INFO)}
							/>
						</dd>
						<dt className={styles['c-request-material__content-label']}>
							{tText(
								'modules/visitor-space/components/material-request-blade/material-request-blade___reden-van-aanvraag'
							)}
						</dt>
						<dd className={styles['c-request-material__content-value']}>
							<TextArea
								className={styles['c-request-material__reason-input']}
								onChange={(e) => setReasonInputValue(e.target.value)}
								value={reasonInputValue}
							/>
						</dd>
					</>
				</dl>
			</div>
		</Blade>
	);
};

export default MaterialRequestBlade;
