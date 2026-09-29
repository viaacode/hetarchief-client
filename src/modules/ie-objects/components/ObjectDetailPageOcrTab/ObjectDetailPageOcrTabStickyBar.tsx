import Metadata from '@ie-objects/components/Metadata/Metadata';
import { OcrSearchInputWithResultsPagination } from '@iiif-viewer/components/SearchInputWithResults/OcrSearchInputWithResultsPagination';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import clsx from 'clsx';
import type { FC } from 'react';
import styles from './ObjectDetailPageOcrTab.module.scss';
import type { ObjectDetailPageOcrTabStickyBarProps } from './ObjectDetailPageOcrTabStickyBar.types';

// Rendered by ObjectDetailPage.tsx inside the page's own sticky header+tabs wrapper (only while
// the OCR tab is active), rather than inside ObjectDetailPageOcrTab itself - that way it rides
// along as part of that single sticky unit instead of needing its own `top` offset coordinated
// with the header's (variable, collapsed-vs-expanded) height.
export const ObjectDetailPageOcrTabStickyBar: FC<ObjectDetailPageOcrTabStickyBarProps> = ({
	arePagesOcrTextsAvailable,
	searchTermsTemp,
	setSearchTermsTemp,
	searchTerms,
	searchResults,
	currentSearchResultIndex,
	onSearch,
	onClearSearch,
	onChangeSearchIndex,
	isScrolled,
}) => {
	return (
		<div className={styles['p-object-detail-ocr-tab__sticky-bar']}>
			<Metadata
				title={tText('modules/ie-objects/object-detail-page___ocr-betrouwbaarheid')}
				key="ocr-disclaimer"
				renderedTitleRight={
					<Icon name={IconNamesLight.Ai} aria-hidden className="u-font-size-24" />
				}
				className="u-bt-0"
			/>

			{arePagesOcrTextsAvailable && (
				// Bottom padding only kept while scrolled - see u-bt-0 above (the disclaimer) for
				// the same pattern of overriding Metadata's own .c-metadata__item spacing from
				// outside. Deliberately not transitioned: this sits inside the page's sticky header
				// unit, and animating it in sync with an active scroll gesture caused a "double
				// scroll" jank (same class of bug the OCR text's own padding-top hit).
				<Metadata key="ocr-search" className={clsx({ 'u-pb-0': !isScrolled })}>
					<OcrSearchInputWithResultsPagination
						id="object-detail-page__ocr-search-input"
						className={styles['p-object-detail-ocr-tab__sticky-bar__search']}
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
		</div>
	);
};
