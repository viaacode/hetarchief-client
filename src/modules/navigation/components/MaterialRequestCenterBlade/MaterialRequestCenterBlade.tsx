import { Button, OrderDirection } from '@meemoo/react-components';
import Image from 'next/image';
import { FC, useMemo, useState } from 'react';

import { useGetMaterialRequests } from '@material-requests/hooks/get-material-requests';
import { Blade, Icon, IconNamesLight, Loading } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';

import styles from './MaterialRequestCenterBlade.module.scss';
import { MaterialRequest, MaterialRequestKeys } from '@material-requests/types';

interface MaterialRequestCenterBladeProps {
	isOpen: boolean;
	onClose: () => void;
}

const MaterialRequestCenterBlade: FC<MaterialRequestCenterBladeProps> = ({ isOpen, onClose }) => {
	const { tText } = useTranslation();

	const { data: materialRequests, isFetching } = useGetMaterialRequests({
		isPersonal: true,
		orderProp: MaterialRequestKeys.maintainer,
		orderDirection: 'asc' as OrderDirection,
	});

	// Ward: create an object containing all the distinct maintainerId's as properties
	// with per property an array of materialRequests, that has the same maintainerId as the property, as value
	const mappedRequests = useMemo(() => {
		return materialRequests?.items.reduce((acc, curr) => {
			// Ward: check if maintainerId is not added yet to object
			if (!acc[curr.maintainerId]) {
				return {
					...acc,
					// Ward: add new property to object and add array, with current item, as value
					[curr.maintainerId]: [curr],
				};
			}

			return {
				...acc,
				// Ward: property already exists, so push item to array as value
				[curr.maintainerId]: [...acc[curr.maintainerId], curr],
			};
		}, {} as { [key: string]: MaterialRequest[] });
	}, [materialRequests]);

	const onCloseBlade = () => {
		onClose();
	};

	const renderTitle = () => {
		return <h2 className={styles['c-material-request-center-blade__title']}>Aanvraaglijst</h2>;
	};

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

	const renderMaintainer = (item: MaterialRequest) => {
		return (
			<div className={styles['c-material-request-center-blade__maintainer']}>
				{/* {item.maintainerLogo && (
								<div
									className={
										styles['c-material-request-center-blade__maintainer-logo']
									}
								>
									<Image
										alt="maintainer logo"
										src={item.maintainerLogo}
										layout="fill"
										objectFit="contain"
									/>
								</div>
							)} */}
				<div
					className={styles['c-material-request-center-blade__maintainer-logo']}
					style={{ color: 'black' }}
				>
					--image--
				</div>
				<div>
					<p className={styles['c-material-request-center-blade__maintainer-details']}>
						Aangevraagd bij
					</p>
					<p className={styles['c-material-request-center-blade__maintainer-details']}>
						{item.maintainerName}
					</p>
				</div>
			</div>
		);
	};

	const renderMaterialRequest = (item: MaterialRequest) => {
		return (
			<a
				tabIndex={-1}
				href={`/zoeken/${item.maintainerSlug}/${item.objectSchemaIdentifier}`}
				className={styles['c-material-request-center-blade__material-link']}
			>
				<div className={styles['c-material-request-center-blade__material']} tabIndex={0}>
					<p className={styles['c-material-request-center-blade__material-label']}>
						<Icon
							className={
								styles['c-material-request-center-blade__material-label-icon']
							}
							name={
								item.objectType === 'audio'
									? IconNamesLight.Audio
									: IconNamesLight.Video
							}
						/>
						<span>{item.objectSchemaName}</span>
					</p>
					<p className={styles['c-material-request-center-blade__material-id']}>
						{item.objectMeemooIdentifier}
					</p>
				</div>
			</a>
		);
	};

	const renderContent = () => {
		return (
			mappedRequests &&
			// Ward: render each unique maintainer
			Object.keys(mappedRequests).map((key) => (
				<>
					{renderMaintainer(mappedRequests[key][0])}

					{/* Ward: render all materialRequests of current maintainer, sorted by objectSchemaName */}
					{mappedRequests[key]
						.sort((a, b) => a.objectSchemaName.localeCompare(b.objectSchemaName))
						.map((item) => renderMaterialRequest(item))}
				</>
			))
		);
	};

	if (isFetching) {
		return (
			<Blade isOpen={isOpen} onClose={onClose} renderTitle={renderTitle}>
				<Loading
					className={styles['c-material-request-center-blade__loading']}
					owner="MaterialRequestCenterBlade: render material requests"
				/>
			</Blade>
		);
	}

	return (
		<Blade
			isOpen={isOpen}
			renderTitle={renderTitle}
			footer={isOpen && renderFooter()}
			onClose={onCloseBlade}
		>
			{renderContent()}
		</Blade>
	);
};

export default MaterialRequestCenterBlade;
