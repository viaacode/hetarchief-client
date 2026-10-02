import { type NamesListProps, ROW_HEIGHT } from '@ie-objects/components/NamesList/NamesList.types';
import { Button, TextInput } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import type { HetArchiefMention } from '@viaa/avo2-types';
import clsx from 'clsx';
import { compact, sortBy } from 'es-toolkit/compat';
import React, {
	type ChangeEvent,
	type CSSProperties,
	type FC,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import CellMeasurer, { CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';
import List, { type ListRowProps } from 'react-virtualized/dist/commonjs/List';

import styles from './NamesList.module.scss';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-virtualized/styles.css';
import { ConfidenceIndicator } from '@ie-objects/components/ConfidenceIndicator/ConfidenceIndicator';
import { isServerSideRendering } from '@shared/utils/is-browser';

export const NamesList: FC<NamesListProps> = ({ className, mentions, onZoomToMention }) => {
	const [searchTermsTemp, setSearchTermsTemp] = useState('');
	const [searchTerms, setSearchTerms] = useState('');
	const [filteredNames, setFilteredNames] = useState<HetArchiefMention[]>(mentions);
	const ref = useRef<HTMLDivElement | null>(null);
	const listRef = useRef<List | null>(null);
	// Rows wrap onto a variable number of lines (long names, narrow viewports), so a fixed
	// rowHeight squashes/overlaps content - this measures each row's real rendered height instead.
	const cacheRef = useRef<CellMeasurerCache | null>(null);
	if (!cacheRef.current) {
		cacheRef.current = new CellMeasurerCache({
			fixedWidth: true,
			defaultHeight: ROW_HEIGHT,
			minHeight: ROW_HEIGHT,
		});
	}
	const cache = cacheRef.current;

	const handleOnChange = (evt: ChangeEvent<HTMLInputElement>): void => {
		setSearchTermsTemp(evt.target.value);
		if (evt.target.value === '') {
			setSearchTerms(evt.target.value);
		}
	};

	const handleSearchIconClicked = () => {
		setSearchTerms(searchTermsTemp);
	};

	const searchNames = useCallback(() => {
		if (searchTerms === '') {
			setFilteredNames(sortBy(mentions, (mention) => 1 - mention.confidence));
		} else {
			const searchTermsLower = searchTerms.toLowerCase();
			setFilteredNames(
				sortBy(
					mentions.filter((mention) => {
						return (
							mention.name?.toLowerCase().includes(searchTermsLower) ||
							mention.birthPlace?.toLowerCase().includes(searchTermsLower) ||
							mention.deathPlace?.toLowerCase().includes(searchTermsLower) ||
							String(mention.birthDate)?.includes(searchTerms) ||
							String(mention.deathDate)?.includes(searchTerms)
						);
					}),
					(mention) => 1 - mention.confidence
				)
			);
		}
	}, [searchTerms, mentions]);

	useEffect(() => {
		searchNames();
	}, [searchNames]);

	// filteredNames changing (search, re-sort) reassigns which mention renders at a given row
	// index, which makes that index's previously-measured height stale.
	// biome-ignore lint/correctness/useExhaustiveDependencies: filteredNames isn't read in the body, only used to re-trigger this on every reorder/refilter
	useEffect(() => {
		cache.clearAll();
		listRef.current?.recomputeRowHeights();
	}, [filteredNames, cache]);

	const renderMention = useCallback(
		(
			mention: HetArchiefMention,
			style: CSSProperties,
			registerChild: (element?: Element | null) => void
		) => {
			const firstHighlight = mention.highlights?.[0];
			return (
				<div ref={registerChild} className={styles['c-names-list__person']} style={style}>
					<div className={styles['c-names-list__person__occurrence-confidence']}>
						<ConfidenceIndicator
							className={styles['c-names-list__person__confidence-indicator']}
							confidence={mention.confidence}
						/>
					</div>
					<div className={clsx(styles['c-names-list__person__info'], 'u-flex-grow')}>
						<div className={styles['c-names-list__person__info__name']}>{mention.name}</div>
						<div className={styles['c-names-list__person__info__dates-and-locations']}>
							<span
								title={tText(
									'modules/ie-objects/components/names-list/names-list___geboorte-jaar-en-plaats'
								)}
							>
								° {compact([mention.birthDate, mention.birthPlace]).join(' ')}
							</span>
							<span className={styles['c-names-list__person__info__dates-and-locations__comma']}>
								,{' '}
							</span>
							<span
								title={tText(
									'modules/ie-objects/components/names-list/names-list___sterfte-jaar-en-plaats'
								)}
							>
								† {compact([mention.deathDate, mention.deathPlace]).join(' ')}
							</span>
						</div>
					</div>
					{firstHighlight.x &&
						firstHighlight.x &&
						firstHighlight.width &&
						firstHighlight.height && (
							<Button
								icon={<Icon name={IconNamesLight.SearchText} aria-hidden />}
								variants={['white']}
								tooltipText={tText(
									'modules/ie-objects/components/names-list/names-list___spring-naar-de-locatie-van-deze-naam'
								)}
								tooltipPosition="left"
								onClick={() => onZoomToMention(mention)}
							/>
						)}

					<a
						href={mention.iri}
						target="_blank"
						rel="noreferrer noopener"
						// Hide if no link, so it does take up space and all links/zoom buttons are nicely below each-other
						style={{ visibility: mention.iri ? 'visible' : 'hidden' }}
					>
						<Button
							icon={<Icon name={IconNamesLight.Extern} className="u-font-size-28" aria-hidden />}
							variants={['white']}
							tooltipText={tText(
								'modules/ie-objects/components/names-list/names-list___meer-info-over-deze-persoon'
							)}
							tooltipPosition="left"
						/>
					</a>
				</div>
			);
		},
		[onZoomToMention]
	);

	const rowRenderer = ({ key, index, style, parent }: ListRowProps) => {
		return (
			<CellMeasurer cache={cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
				{({ registerChild }) => renderMention(filteredNames[index], style, registerChild)}
			</CellMeasurer>
		);
	};

	const noRowsRenderer = () => {
		return (
			<div className={styles['c-names-list__person-container__no-results']}>
				{tText(
					'modules/ie-objects/components/names-list/names-list___we-konden-geen-resultaten-vinden-gelieve-een-andere-zoekterm-in-te-geven'
				)}
			</div>
		);
	};

	if (isServerSideRendering()) {
		// This is a workaround for the server side rendering issue with react-virtualized
		return null;
	}
	return (
		<div className={clsx(className, styles['c-names-list'])} ref={ref}>
			<TextInput
				id="person-names-search"
				type="search"
				className={styles['c-names-list__search']}
				iconEnd={
					<Icon name={IconNamesLight.Search} onClick={handleSearchIconClicked} aria-hidden />
				}
				placeholder={tText(
					'modules/ie-objects/components/names-list/names-list___zoek-op-naam-locatie-jaar'
				)}
				value={searchTermsTemp}
				onChange={handleOnChange}
				onEnter={() => setSearchTerms(searchTermsTemp)}
				ariaLabel={tText(
					'modules/ie-objects/components/names-list/names-list___zoek-naar-een-persoonsnaam-in-deze-krant-input-aria-label'
				)}
			/>
			<List
				ref={listRef}
				deferredMeasurementCache={cache}
				rowCount={filteredNames.length}
				rowHeight={cache.rowHeight}
				rowRenderer={rowRenderer}
				noRowsRenderer={noRowsRenderer}
				autoContainerWidth={true}
				autoWidth={true}
				width={1000}
				height={Math.min(288, ROW_HEIGHT * filteredNames.length)}
				columnCount={1}
			/>
		</div>
	);
};
