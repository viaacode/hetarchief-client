import { Button, TextInput } from '@meemoo/react-components';
import clsx from 'clsx';
import type { FC, KeyboardEvent } from 'react';

import type { SearchInputWithResultsPaginationProps } from '@iiif-viewer/components/SearchInputWithResults/SearchInputWithResultsPagination.types';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';

import styles from './SearchInputWithResultsPagination.module.scss';

export const SearchInputWithResultsPagination: FC<SearchInputWithResultsPaginationProps> = ({
	value,
	onChange,
	onSearch,
	onClearSearch,
	onChangeSearchIndex,
	searchResults,
	currentSearchIndex,
	className,
	variants = [],
}) => {
	const handleKeyUp = (evt: KeyboardEvent<HTMLInputElement>) => {
		if (evt.key === 'Enter') {
			onSearch(value);
		}
	};

	return (
		<div
			className={clsx(
				styles['c-search-with-results-pagination'],
				...variants.map((variant) => styles[`c-search-with-results-pagination__${variant}`]),
				className
			)}
		>
			<TextInput
				value={value}
				onChange={(evt) => onChange(evt.target.value)}
				onKeyUp={handleKeyUp}
				variants={variants}
				placeholder={tText(
					'modules/iiif-viewer/components/search-input-with-results/search-input-with-results-pagination___zoek'
				)}
			/>
			{!!searchResults && (
				<>
					<Button
						iconStart={<Icon name={IconNamesLight.AngleLeft} />}
						aria-label={tText(
							'modules/iiif-viewer/components/search-input-with-results/search-input-with-results-pagination___vorig-zoekresultaat'
						)}
						variants={['text', ...variants]}
						onClick={() => onChangeSearchIndex(currentSearchIndex - 1)}
						disabled={currentSearchIndex === 0 || searchResults.length === 0}
					/>
					<span className="pagination-info">
						{searchResults.length <= 0
							? tText(
									'modules/iiif-viewer/components/search-input-with-results/search-input-with-results-pagination___0-resultaten'
								)
							: tText(
									'modules/iiif-viewer/components/search-input-with-results/search-input-with-results-pagination___current-search-index-van-de-total-search-results',
									{
										currentSearchIndex: currentSearchIndex + 1,
										totalSearchResults: searchResults.length,
									}
								)}
					</span>
					<Button
						iconStart={<Icon name={IconNamesLight.AngleRight} />}
						aria-label={tText(
							'modules/iiif-viewer/components/search-input-with-results/search-input-with-results-pagination___volgend-zoekresultaat'
						)}
						variants={['text', ...variants]}
						onClick={() => onChangeSearchIndex(currentSearchIndex + 1)}
						disabled={currentSearchIndex === searchResults.length - 1 || searchResults.length === 0}
					/>
					<Button
						iconStart={<Icon name={IconNamesLight.Times} />}
						aria-label={tText(
							'modules/iiif-viewer/components/search-input-with-results/search-input-with-results-pagination___verwijder-zoekterm'
						)}
						variants={['text', ...variants]}
						onClick={() => onClearSearch()}
					/>
				</>
			)}
			{!searchResults && (
				<Button
					iconStart={<Icon name={IconNamesLight.Search} />}
					aria-label={tText(
						'modules/iiif-viewer/components/search-input-with-results/search-input-with-results-pagination___zoek-opdracht-uitvoeren'
					)}
					variants={['text', ...variants]}
					onClick={() => onSearch(value)}
					disabled={!value}
				/>
			)}
		</div>
	);
};
