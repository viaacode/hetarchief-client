import Metadata from '@ie-objects/components/Metadata/Metadata';
import MetadataList from '@ie-objects/components/Metadata/MetadataList';
import { OcrSearchInputWithResultsPagination } from '@iiif-viewer/components/SearchInputWithResults/OcrSearchInputWithResultsPagination';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tHtml, tText } from '@shared/helpers/translate';
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
}) => {
	return (
		<div className={styles['p-object-detail-ocr-tab__sticky-bar']}>
			<MetadataList allowTwoColumns={false}>
				<Metadata
					title={tText('modules/ie-objects/object-detail-page___ocr-betrouwbaarheid')}
					key="ocr-disclaimer"
					renderedTitleRight={<Icon name={IconNamesLight.Ai} aria-hidden />}
					className="u-bt-0"
				>
					{tHtml(
						'modules/ie-objects/object-detail-page___deze-ocr-kan-fouten-bevatten-a-href-ocr-betrouwbaarheid-info-meer-info-vind-je-hier-a'
					)}
				</Metadata>
			</MetadataList>

			{arePagesOcrTextsAvailable && (
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
			)}
		</div>
	);
};
