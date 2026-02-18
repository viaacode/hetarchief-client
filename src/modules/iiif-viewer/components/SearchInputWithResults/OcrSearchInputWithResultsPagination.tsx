import type { SearchInputWithResultsPaginationProps } from '@iiif-viewer/components/SearchInputWithResults/SearchInputWithResultsPagination.types';
import { Button, TextInput } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import clsx from 'clsx';
import type { FC } from 'react';

import styles from './SearchInputWithResultsPagination.module.scss';

export const OcrSearchInputWithResultsPagination: FC<SearchInputWithResultsPaginationProps> = ({
	id,
	value,
	onChange,
	onSearch,
	onClearSearch,
	onChangeSearchIndex,
	searchResults,
	currentSearchIndex,
	className,
	variants = [],
	searchInputAriaLabel,
}) => {
	return (
		<div
			className={clsx(
				styles['c-search-with-results-pagination'],
				...variants.map((variant) => styles[`c-search-with-results-pagination__${variant}`]),
				className
			)}
		>
			<TextInput
				id={`ocr-search-input-with-results-pagination--${id}`}
				value={value}
				onChange={(evt) => onChange(evt.target.value)}
				onEnter={() => onSearch(value)}
				variants={variants}
				placeholder={tText(
					'modules/iiif-viewer/components/search-input-with-results/search-input-with-results-pagination___zoek'
				)}
				ariaLabel={searchInputAriaLabel}
			/>
			{!!searchResults && (
				<>
					<Button
						iconStart={<Icon name={IconNamesLight.AngleLeft} aria-hidden />}
						ariaLabel={tText(
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
										currentSearchIndex: currentSearchIndex + 1 > 0 ? currentSearchIndex + 1 : 1, // Default to 1 if zero or negative: https://meemoo.atlassian.net/browse/ARC-3071
										totalSearchResults: searchResults.length,
									}
								)}
					</span>
					<Button
						iconStart={<Icon name={IconNamesLight.AngleRight} aria-hidden />}
						ariaLabel={tText(
							'modules/iiif-viewer/components/search-input-with-results/search-input-with-results-pagination___volgend-zoekresultaat'
						)}
						variants={['text', ...variants]}
						onClick={() => onChangeSearchIndex(currentSearchIndex + 1)}
						disabled={currentSearchIndex === searchResults.length - 1 || searchResults.length === 0}
					/>
					<Button
						iconStart={<Icon name={IconNamesLight.Times} aria-hidden />}
						ariaLabel={tText(
							'modules/iiif-viewer/components/search-input-with-results/search-input-with-results-pagination___verwijder-zoekterm'
						)}
						variants={['text', ...variants]}
						onClick={() => onClearSearch()}
					/>
				</>
			)}
			{!searchResults && (
				<Button
					iconStart={<Icon name={IconNamesLight.Search} aria-hidden />}
					ariaLabel={tText(
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
