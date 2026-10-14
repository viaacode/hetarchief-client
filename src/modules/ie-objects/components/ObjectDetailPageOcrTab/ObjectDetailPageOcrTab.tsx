import Metadata from '@ie-objects/components/Metadata/Metadata';
import { OcrSearchInputWithResultsPagination } from '@iiif-viewer/components/SearchInputWithResults/OcrSearchInputWithResultsPagination';
import { Alert, Button } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tHtml, tText } from '@shared/helpers/translate';
import clsx from 'clsx';
import { isEqual } from 'es-toolkit/compat';
import { type FC, useEffect, useMemo, useRef } from 'react';
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
	onProgrammaticScrollChange,
}) => {
	const searchStickySentinelRef = useRef<HTMLDivElement>(null);
	const activeWordRef = useRef<HTMLSpanElement>(null);
	// Which result (page + index) we last scrolled to, so unrelated re-renders of the OCR text
	// (overlay toggle, new callback identities after a router.replace) don't yank the user back
	const lastScrolledResultRef = useRef<string | null>(null);

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
							ref={isActive ? activeWordRef : undefined}
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
			// Forget the last result, so searching for the same result again scrolls again
			lastScrolledResultRef.current = null;
			return;
		}
		// The effect also runs when the text re-renders (the word can arrive after the page change),
		// but must only scroll once per result
		const resultKey = `${currentPageIndex}:${currentSearchResultIndex}`;
		if (lastScrolledResultRef.current === resultKey) {
			return;
		}
		lastScrolledResultRef.current = resultKey;
		const wordTop =
			word.getBoundingClientRect().top -
			container.getBoundingClientRect().top +
			container.scrollTop;
		const target = Math.max(0, wordTop - container.clientHeight / 2);

		// A result near the top of its page (e.g. the first match after a page change) would
		// otherwise land scrollTop at/near 0 and make the sidebar's collapse-sentinel observer think
		// the user scrolled back up, re-expanding the header. Flag this as programmatic instead.
		onProgrammaticScrollChange(true);
		container.scrollTo({ top: target });

		const clearFlag = () => onProgrammaticScrollChange(false);
		// Two rAFs, not scrollend: an instant (non-smooth) scrollTo can fire scrollend before the
		// browser's own IntersectionObserver notification queue - which runs once per rendering
		// frame - has processed the resulting sentinel intersection, clearing the flag too early.
		// Two frames reliably lands after that queue has been flushed at least once.
		let secondFrame = 0;
		const firstFrame = requestAnimationFrame(() => {
			secondFrame = requestAnimationFrame(clearFlag);
		});
		// Fallback in case rAF never fires (e.g. the tab loses focus) - without it the flag could
		// get stuck true and permanently block the header from expanding on scroll.
		const fallbackTimeout = window.setTimeout(clearFlag, 1000);

		return () => {
			cancelAnimationFrame(firstFrame);
			cancelAnimationFrame(secondFrame);
			window.clearTimeout(fallbackTimeout);
			clearFlag();
		};
	}, [
		scrollContainerRef,
		currentSearchResultIndex,
		currentPageIndex,
		renderedOcrText,
		onProgrammaticScrollChange,
	]);

	return (
		<div className={clsx(styles['p-object-detail-ocr-tab'])}>
			<Alert
				className={styles['p-object-detail-ocr-tab__disclaimer']}
				content={
					<div className={styles['p-object-detail-ocr-tab__disclaimer-content']}>
						{tHtml(
							'modules/ie-objects/object-detail-page___deze-ocr-kan-fouten-bevatten-a-href-ocr-betrouwbaarheid-info-meer-info-vind-je-hier-a'
						)}
						<Icon name={IconNamesLight.Console} aria-hidden className="u-font-size-24" />
					</div>
				}
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
					className={clsx(styles['p-object-detail-ocr-tab__search'], 'u-bt-0')}
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
