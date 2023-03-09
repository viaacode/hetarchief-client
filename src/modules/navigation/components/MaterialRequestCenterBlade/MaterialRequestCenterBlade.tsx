import { Button, OrderDirection } from '@meemoo/react-components';
import Image from 'next/image';
import { FC, useMemo, useState } from 'react';

import { useGetMaterialRequests } from '@material-requests/hooks/get-material-requests';
import { MaterialRequest, MaterialRequestKeys } from '@material-requests/types';
import { Blade, Icon, IconNamesLight, Loading } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';

import styles from './MaterialRequestCenterBlade.module.scss';

interface MaterialRequestCenterBladeProps {
	isOpen: boolean;
	onClose: () => void;
}

const MaterialRequestCenterBlade: FC<MaterialRequestCenterBladeProps> = ({ isOpen, onClose }) => {
	const { tHtml, tText } = useTranslation();

	const { data: materialRequests, isFetching } = useGetMaterialRequests({
		isPersonal: true,
		orderProp: MaterialRequestKeys.maintainer,
		orderDirection: 'asc' as OrderDirection,
		// Ward: if no size is given, only 10 results will be returned
		size: 500,
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
		return (
			<div className={styles['c-material-request-center-blade__title-container']}>
				<h4 className={styles['c-material-request-center-blade__title']}>
					{tText(
						'modules/navigation/components/material-request-center-blade/material-request-center-blade___aanvraaglijst'
					)}
				</h4>
				{mappedRequests && Object.keys(mappedRequests).length > 1 && (
					<p className={styles['c-material-request-center-blade__subtitle']}>
						{tHtml(
							'modules/navigation/components/material-request-center-blade/material-request-center-blade___meerdere-aanbieders'
						)}
					</p>
				)}
			</div>
		);
	};

	const renderFooter = () => {
		return (
			<div className={styles['c-material-request-center-blade__close-button-container']}>
				<Button
					label={tText(
						'modules/navigation/components/material-request-center-blade/material-request-center-blade___vul-gegevens-aan'
					)}
					variants={['block', 'text']}
					onClick={onClose}
					className={styles['c-material-request-center-blade__send-button']}
				/>
				<Button
					label={tText(
						'modules/navigation/components/material-request-center-blade/material-request-center-blade___sluit'
					)}
					variants={['block', 'text']}
					onClick={onClose}
					className={styles['c-material-request-center-blade__close-button']}
				/>
			</div>
		);
	};

	const renderMaintainer = (item: MaterialRequest, length: number) => {
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
						{tText(
							'modules/navigation/components/material-request-center-blade/material-request-center-blade___aangevraagd'
						)}
					</p>
					<p className={styles['c-material-request-center-blade__maintainer-details']}>
						{item.maintainerName} ({length})
					</p>
				</div>
			</div>
		);
	};

	const renderMaterialRequest = (item: MaterialRequest) => {
		return (
			<div className={styles['c-material-request-center-blade__material-container']}>
				<a
					tabIndex={-1}
					href={`/zoeken/${item.maintainerSlug}/${item.objectSchemaIdentifier}`}
					className={styles['c-material-request-center-blade__material-link']}
				>
					<div
						className={styles['c-material-request-center-blade__material']}
						tabIndex={0}
					>
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
				<div className={styles['c-material-request-center-blade__material-actions']}>
					<Button
						key={'edit-material-request'}
						className={
							styles['c-material-request-center-blade__material-actions-button']
						}
						onClick={() => console.log('edit')}
						variants={['silver']}
						name="Edit"
						icon={<Icon name={IconNamesLight.Edit} aria-hidden />}
						aria-label={tText(
							'modules/navigation/components/material-request-center-blade/material-request-center-blade___pas-je-aanvraag-aan'
						)}
					/>
					<Button
						key={'delete-material-request'}
						onClick={() => console.log('delete')}
						variants={['silver']}
						name="Delete"
						icon={<Icon name={IconNamesLight.Trash} aria-hidden />}
						aria-label={tText(
							'modules/navigation/components/material-request-center-blade/material-request-center-blade___verwijder-materiaal-aanvraag'
						)}
					/>
				</div>
			</div>
		);
	};

	const renderContent = () => {
		return (
			mappedRequests &&
			// Ward: render each unique maintainer
			Object.keys(mappedRequests).map((key) => (
				<>
					{renderMaintainer(mappedRequests[key][0], mappedRequests[key].length)}

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
