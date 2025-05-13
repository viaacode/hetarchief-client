import type { NamesListProps } from '@ie-objects/components/NamesList/NamesList.types';
import type { Mention } from '@ie-objects/ie-objects.types';
import { Button, TextInput } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import clsx from 'clsx';
import { compact, sortBy } from 'lodash-es';
import React, {
	type ChangeEvent,
	type CSSProperties,
	type FC,
	type KeyboardEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import List, { type ListRowProps } from 'react-virtualized/dist/commonjs/List';

import styles from './NamesList.module.scss';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-virtualized/styles.css';
import ConfidenceIndicator from '@ie-objects/components/ConfidenceIndicator/ConfidenceIndicator';
import { isServerSideRendering } from '@shared/utils/is-browser';

export const NamesList: FC<NamesListProps> = ({ className, mentions, onZoomToMention }) => {
	const [searchTermsTemp, setSearchTermsTemp] = useState('');
	const [searchTerms, setSearchTerms] = useState('');
	const [filteredNames, setFilteredNames] = useState<Mention[]>(mentions);
	const ref = useRef<HTMLDivElement | null>(null);

	const handleOnChange = (evt: ChangeEvent<HTMLInputElement>): void => {
		setSearchTermsTemp(evt.target.value);
		if (evt.target.value === '') {
			setSearchTerms(evt.target.value);
		}
	};

	const handleOnKeyUp = useCallback(
		(evt: KeyboardEvent<HTMLInputElement>): void => {
			if (evt.key === 'Enter') {
				setSearchTerms(searchTermsTemp);
			}
		},
		[searchTermsTemp]
	);

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

	const renderMention = useCallback(
		(mention: Mention, key: string, style: CSSProperties) => {
			const firstHighlight = mention.highlights?.[0];
			return (
				<div key={key} className={styles['c-names-list__person']} style={style}>
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
								icon={<Icon name={IconNamesLight.SearchText} />}
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
							icon={<Icon name={IconNamesLight.Extern} className="u-font-size-28" />}
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

	const rowRenderer = ({ key, index, style }: ListRowProps) => {
		return renderMention(filteredNames[index], key, style);
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
			<List
				rowCount={filteredNames.length}
				rowHeight={81}
				rowRenderer={rowRenderer}
				noRowsRenderer={noRowsRenderer}
				autoContainerWidth={true}
				autoWidth={true}
				width={1000}
				height={300}
				columnCount={1}
			/>
		</div>
	);
};
