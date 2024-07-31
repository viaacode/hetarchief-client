import { Button, TextInput } from '@meemoo/react-components';
import clsx from 'clsx';
import React, {
	type ChangeEvent,
	type FC,
	type KeyboardEvent,
	useCallback,
	useEffect,
	useState,
} from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { ConfidenceIndicator } from '@ie-objects/components/ConfidenceIndicator/ConfidenceIndicator';
import { type NamesListProps } from '@ie-objects/components/NamesList/NamesList.types';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';

import styles from './NamesList.module.scss';
import 'react-perfect-scrollbar/dist/css/styles.css';

export const NamesList: FC<NamesListProps> = ({ className, names, onZoomToLocation }) => {
	const [searchTermsTemp, setSearchTermsTemp] = useState('');
	const [searchTerms, setSearchTerms] = useState('');
	const [filteredNames, setFilteredNames] = useState(names);

	function handleOnChange(evt: ChangeEvent<HTMLInputElement>): void {
		setSearchTermsTemp(evt.target.value);
	}

	function handleOnKeyUp(evt: KeyboardEvent<HTMLInputElement>): void {
		if (evt.key === 'Enter') {
			setSearchTerms(searchTermsTemp);
		}
	}

	const searchNames = useCallback(() => {
		if (searchTerms === '') {
			setFilteredNames(names);
		} else {
			const searchTermsLower = searchTerms.toLowerCase();
			setFilteredNames(
				names.filter((nameInfo) => {
					return (
						nameInfo.name.toLowerCase().includes(searchTermsLower) ||
						nameInfo.bornLocation.toLowerCase().includes(searchTermsLower) ||
						nameInfo.diedLocation.toLowerCase().includes(searchTermsLower) ||
						nameInfo.bornYear.includes(searchTerms) ||
						nameInfo.diedYear.includes(searchTerms)
					);
				})
			);
		}
	}, [searchTerms, names]);

	useEffect(() => {
		searchNames();
	}, [searchNames]);

	return (
		<div className={clsx(className, styles['c-names-list'])}>
			<TextInput
				type="search"
				className={styles['c-names-list__search']}
				iconEnd={<Icon name={IconNamesLight.Search} />}
				placeholder={tText(
					'modules/ie-objects/components/names-list/names-list___zoek-op-naam-locatie-jaar'
				)}
				value={searchTermsTemp}
				onChange={handleOnChange}
				onKeyUp={handleOnKeyUp}
			/>
			<PerfectScrollbar className={styles['c-names-list__person-container']}>
				{filteredNames.map((nameInfo, index) => (
					<div key={index} className={styles['c-names-list__person']}>
						<div className={styles['c-names-list__person__occurrence-confidence']}>
							<ConfidenceIndicator
								className={styles['c-names-list__person__confidence-indicator']}
								confidence={nameInfo.ocrConfidence}
							/>
						</div>
						<div className={clsx(styles['c-names-list__person__info'], 'u-flex-grow')}>
							<div className={styles['c-names-list__person__info__name']}>
								{nameInfo.name}
							</div>
							<div
								className={
									styles['c-names-list__person__info__dates-and-locations']
								}
							>
								° {nameInfo.bornYear} {nameInfo.bornLocation}, † {nameInfo.diedYear}{' '}
								{nameInfo.diedLocation}
							</div>
						</div>
						{nameInfo.ocrLocationX && nameInfo.ocrLocationY && (
							<Button
								icon={<Icon name={IconNamesLight.SearchText} />}
								variants={['white']}
								tooltipText={tText(
									'modules/ie-objects/components/names-list/names-list___spring-naar-de-locatie-van-deze-naam'
								)}
								tooltipPosition="left"
								onClick={() =>
									onZoomToLocation(nameInfo.ocrLocationX, nameInfo.ocrLocationY)
								}
							/>
						)}

						<a
							href={nameInfo.link}
							target="_blank"
							rel="noreferrer noopener"
							style={{ visibility: nameInfo.link ? 'visible' : 'hidden' }}
						>
							<Button
								icon={
									<Icon name={IconNamesLight.Extern} className="u-font-size-28" />
								}
								variants={['white']}
								tooltipText={tText(
									'modules/ie-objects/components/names-list/names-list___meer-info-over-deze-persoon'
								)}
								tooltipPosition="left"
								onClick={() =>
									onZoomToLocation(nameInfo.ocrLocationX, nameInfo.ocrLocationY)
								}
							/>
						</a>
					</div>
				))}
			</PerfectScrollbar>
		</div>
	);
};

export default NamesList;
