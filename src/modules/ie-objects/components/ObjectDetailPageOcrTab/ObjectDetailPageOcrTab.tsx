import Metadata from '@ie-objects/components/Metadata/Metadata';
import { OcrSearchInputWithResultsPagination } from '@iiif-viewer/components/SearchInputWithResults/OcrSearchInputWithResultsPagination';
import { Button } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import clsx from 'clsx';
import { isEqual } from 'es-toolkit/compat';
import { type FC, useEffect, useMemo, useRef, useState } from 'react';
import styles from './ObjectDetailPageOcrTab.module.scss';
import type { ObjectDetailPageOcrTabProps } from './ObjectDetailPageOcrTab.types';

// Disclaimer, search bar, OCR text and pagination all render here now, in that order, so the
// disclaimer scrolls away with the rest of the tab's content while the search bar - sticky in its
// own right (see its own comment below) - catches and stays pinned right where the disclaimer
// used to be, once it's scrolled past.
export const ObjectDetailPageOcrTab: FC<ObjectDetailPageOcrTabProps> = ({
	ieObjectId,
	altoText,
	altoTextsOnCurrentPageForSearchTerms,
	searchResults,
	currentSearchResultIndex,
	currentPageIndex,
	pageCount,
	setCurrentPageIndex,
	searchTermWords,
	onClickOnOcrWord,
	isTextOverlayVisible,
	onIsTextOverlayVisibleChange,
	arePagesOcrTextsAvailable,
	searchTermsTemp,
	setSearchTermsTemp,
	searchTerms,
	onSearch,
	onClearSearch,
	onChangeSearchIndex,
	scrollContainerRef,
}) => {
	// Whether the search item is actually stuck (pinned at its sticky offset), not merely whether
	// scrolling has started - see &__search-sentinel's own comment for how the sentinel's position
	// makes this line up with the item's real sticky `top`.
	const [isSearchStuck, setIsSearchStuck] = useState(false);
	const searchStickySentinelRef = useRef<HTMLDivElement>(null);
	const activeWordRef = useRef<HTMLSpanElement>(null);

	// The sentinel only renders once the OCR texts are available, which can be after mount
	// biome-ignore lint/correctness/useExhaustiveDependencies: arePagesOcrTextsAvailable decides whether the sentinel exists
	useEffect(() => {
		const root = scrollContainerRef.current;
		const sentinel = searchStickySentinelRef.current;
		if (!root || !sentinel) {
			return;
		}
		const observer = new IntersectionObserver(
			([entry]) => setIsSearchStuck(!entry.isIntersecting),
			{
				root,
				threshold: 0,
			}
		);
		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [scrollContainerRef, arePagesOcrTextsAvailable]);

	const renderedOcrText = useMemo(() => {
		let searchTermIndex = 0;
		return (
			<div className={styles['p-object-detail-ocr-tab__words-container']}>
				{altoText?.map((textLocation, textIndex) => {
					const foundAltoText = altoTextsOnCurrentPageForSearchTerms.find((item) =>
						isEqual(item.text, textLocation)
					);
					const isMarked: boolean = !!foundAltoText;
					const isTabbable: boolean = !!foundAltoText?.tabbable;

					// Search results are counted per page, so we need to subtract the amount of results in previous page
					const searchResultsOnPreviousPages: number =
						searchResults?.filter((result) => result.pageIndex < currentPageIndex).length || 0;
					const searchResultIndexWithinCurrentPage: number =
						(currentSearchResultIndex || 0) - searchResultsOnPreviousPages;
					const isActive: boolean =
						!!searchTermWords &&
						isTabbable &&
						searchTermIndex === searchResultIndexWithinCurrentPage;

					const wordElement = (
						// biome-ignore lint/a11y/noStaticElementInteractions: We need it this way
						<span
							key={`ocr-text--${ieObjectId}--${currentPageIndex}--${
								// biome-ignore lint/suspicious/noArrayIndexKey: _
								textIndex
							}`}
							onClick={() => onClickOnOcrWord(textLocation)}
							onKeyUp={(evt) => {
								if (evt.key === 'Enter') {
									onClickOnOcrWord(textLocation);
								}
							}}
							onDoubleClick={() => onIsTextOverlayVisibleChange(!isTextOverlayVisible)}
							className={clsx(styles['p-object-detail-ocr-tab__word'], {
								[styles['p-object-detail-ocr-tab__word--marked']]: isMarked,
								[styles['p-object-detail-ocr-tab__word--marked--active']]: isActive,
							})}
						>
							{textLocation.text}{' '}
						</span>
					);

					if (isTabbable) {
						searchTermIndex += 1;
					}

					return wordElement;
				})}
			</div>
		);
	}, [
		altoText,
		altoTextsOnCurrentPageForSearchTerms,
		searchResults,
		currentSearchResultIndex,
		ieObjectId,
		currentPageIndex,
		searchTermWords,
		onClickOnOcrWord,
		onIsTextOverlayVisibleChange,
		isTextOverlayVisible,
	]);

	// Scroll the active search result to the middle of the page's scroll container
	// We don't use scrollIntoView because it causes scrolling on the whole page
	// https://meemoo.atlassian.net/browse/ARC-3020
	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run whenever the active result or its page changes
	useEffect(() => {
		const container = scrollContainerRef.current;
		const word = activeWordRef.current;
		if (!container || !word) {
			return;
		}
		const wordTop =
			word.getBoundingClientRect().top -
			container.getBoundingClientRect().top +
			container.scrollTop;
		container.scrollTo({ top: Math.max(0, wordTop - container.clientHeight / 2) });
	}, [scrollContainerRef, currentSearchResultIndex, currentPageIndex, renderedOcrText]);

	return (
		<div className={clsx(styles['p-object-detail-ocr-tab'])}>
			<Metadata
				title={tText('modules/ie-objects/object-detail-page___ocr-betrouwbaarheid')}
				key="ocr-disclaimer"
				renderedTitleRight={
					<Icon name={IconNamesLight.Ai} aria-hidden className="u-font-size-24" />
				}
				className="u-bt-0"
			/>

			{arePagesOcrTextsAvailable && (
				<div
					ref={searchStickySentinelRef}
					className={styles['p-object-detail-ocr-tab__search-sentinel']}
				/>
			)}
			{arePagesOcrTextsAvailable && (
				// Top border only kept while in normal flow, above - reuses u-bt-0 (an
				// !important utility) to override Metadata's own .c-metadata__item divider once
				// stuck flush against the tabs, the same way it's used unconditionally on the
				// disclaimer above.
				<Metadata
					key="ocr-search"
					className={clsx(styles['p-object-detail-ocr-tab__search'], {
						'u-bt-0': isSearchStuck,
					})}
				>
					<OcrSearchInputWithResultsPagination
						id="object-detail-page__ocr-search-input"
						value={searchTermsTemp}
						onChange={setSearchTermsTemp}
						onSearch={(newSearchTerms) => onSearch(newSearchTerms)}
						onClearSearch={onClearSearch}
						searchResults={searchTerms ? searchResults : null}
						currentSearchIndex={currentSearchResultIndex || 0}
						onChangeSearchIndex={onChangeSearchIndex}
						searchInputAriaLabel={tText(
							'modules/ie-objects/object-detail-page___zoek-tekst-in-deze-krant-input-aria-label'
						)}
					/>
				</Metadata>
			)}

			{renderedOcrText}

			<div className={styles['p-object-detail-ocr-tab__pagination-bar']}>
				<div className={styles['p-object-detail-ocr-tab__pagination']}>
					<Button
						className={clsx(styles['p-object-detail-ocr-tab__pagination__button'], {
							[styles['p-object-detail-ocr-tab__pagination__button--active']]: currentPageIndex > 0,
						})}
						iconStart={<Icon name={IconNamesLight.AngleLeft} aria-hidden />}
						ariaLabel={tText('modules/iiif-viewer/iiif-viewer___ga-naar-de-vorige-afbeelding')}
						label={tText('modules/ie-objects/object-detail-page___vorige')}
						variants={['text']}
						onClick={() => {
							setCurrentPageIndex(currentPageIndex - 1, 'replaceIn');
						}}
						disabled={currentPageIndex === 0}
					/>
					<span className="pagination-info">
						{tText('modules/ie-objects/object-detail-page___pagina-current-page-van-total-pages', {
							currentPage: currentPageIndex + 1,
							totalPages: pageCount || 1,
						})}
					</span>
					<Button
						className={clsx(styles['p-object-detail-ocr-tab__pagination__button'], {
							[styles['p-object-detail-ocr-tab__pagination__button--active']]:
								currentPageIndex < pageCount - 1,
						})}
						iconEnd={<Icon name={IconNamesLight.AngleRight} aria-hidden />}
						ariaLabel={tText('modules/iiif-viewer/iiif-viewer___ga-naar-de-volgende-afbeelding')}
						label={tText('modules/ie-objects/object-detail-page___volgende')}
						variants={['text']}
						onClick={() => {
							setCurrentPageIndex(currentPageIndex + 1, 'replaceIn');
						}}
						disabled={currentPageIndex === pageCount - 1}
					/>
				</div>
			</div>
		</div>
	);
};
