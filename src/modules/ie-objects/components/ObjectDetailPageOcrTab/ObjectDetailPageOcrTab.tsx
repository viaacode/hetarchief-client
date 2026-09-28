import { Button } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import clsx from 'clsx';
import { isEqual } from 'es-toolkit/compat';
import { type FC, useMemo } from 'react';
import styles from './ObjectDetailPageOcrTab.module.scss';
import type { ObjectDetailPageOcrTabProps } from './ObjectDetailPageOcrTab.types';

// The disclaimer + search bar are rendered separately by ObjectDetailPageOcrTabStickyBar (see its
// own comment for why) - this component is only the part of the tab that actually scrolls: the
// OCR text, plus a pagination bar that stays pinned to the bottom of the shared scroll container.
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
}) => {
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

	return (
		<div className={clsx(styles['p-object-detail-ocr-tab'])}>
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
