import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, useEffect, useRef, useState } from 'react';
import { StringParam, useQueryParams } from 'use-query-params';

import {
	Loading,
	SearchBar,
	VisitorSpaceCardList,
	VisitorSpaceCardProps,
} from '@shared/components';
import { VisitorSpaceCardType } from '@shared/components/VisitorSpaceCard';
import { SEARCH_QUERY_KEY } from '@shared/const';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { Breakpoints } from '@shared/types';
import { useGetVisitorSpaces } from '@visitor-space/hooks/get-visitor-spaces';
import { VisitorSpaceInfo, VisitorSpaceStatus } from '@visitor-space/types';

const NUMBER_OF_VISITOR_SPACES = 6;
const NUMBER_OF_VISITOR_SPACES_MOBILE = 3;

const labelKeys = {
	search: 'VisitorSpaceCardsWithSearch__search',
};

interface VisitorSpaceCardsWithSearchProps {
	onRequestAccess: (VisitorSpaceSlug: string) => void;
	onSearch?: (value?: string) => void;
}

const VisitorSpaceCardsWithSearch: FC<VisitorSpaceCardsWithSearchProps> = ({
	onRequestAccess,
	onSearch,
}) => {
	const { tHtml, tText } = useTranslation();
	const [query, setQuery] = useQueryParams({
		[SEARCH_QUERY_KEY]: StringParam,
	});
	const [areAllVisitorSpacesVisible, setAreAllVisitorSpacesVisible] = useState(false);
	const resultsAnchor = useRef<HTMLDivElement | null>(null);

	const { data: visitorSpaces, isLoading: isLoadingVisitorSpaces } = useGetVisitorSpaces(
		query.search || undefined,
		[VisitorSpaceStatus.Active],
		0,
		areAllVisitorSpacesVisible ? 200 : NUMBER_OF_VISITOR_SPACES
	);

	// We need different functionalities for different viewport sizes
	const windowSize = useWindowSizeContext();
	const isMobile = !!(windowSize.width && windowSize.width < Breakpoints.md);

	useEffect(() => {
		if (query[SEARCH_QUERY_KEY] && resultsAnchor) {
			document.body.scrollTo({ top: resultsAnchor.current?.offsetTop, behavior: 'smooth' });
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	/**
	 * Methods
	 */

	const handleLoadAllVisitorSpaces = () => {
		setAreAllVisitorSpacesVisible(true);
	};

	/**
	 * Computed
	 */

	const visitorSpacesLength = visitorSpaces?.items?.length ?? 0;
	const showLoadMore =
		!areAllVisitorSpacesVisible &&
		(((visitorSpaces?.total ?? 0) > NUMBER_OF_VISITOR_SPACES && !isMobile) ||
			((visitorSpaces?.total ?? 0) > NUMBER_OF_VISITOR_SPACES_MOBILE && isMobile));

	/**
	 * Render
	 */

	return (
		<div className="l-container u-pt-32 u-pt-80:md u-pb-48 u-pb-80:md">
			<div id="p-home__results-anchor" ref={resultsAnchor} />
			<div className="u-flex u-flex-col u-flex-row:md u-align-center u-justify-between:md u-mb-32 u-mb-80:md">
				<h3 className="p-home__subtitle">
					<label htmlFor={labelKeys.search}>
						{tHtml('pages/index___vind-een-bezoekersruimte')}
					</label>
				</h3>

				<SearchBar
					id={labelKeys.search}
					default={query[SEARCH_QUERY_KEY] || undefined}
					variants={['rounded', 'grey', 'icon--double', 'icon-clickable']}
					placeholder={tText(
						'modules/home/components/visitor-space-cards-with-search/visitor-space-cards-with-search___zoek'
					)}
					onSearch={(value) => {
						setQuery({ [SEARCH_QUERY_KEY]: value });
						onSearch?.(value);
					}}
				/>
			</div>

			{isLoadingVisitorSpaces && <Loading owner="visitor space cards with search" />}
			{!isLoadingVisitorSpaces && visitorSpaces?.items?.length === 0 && (
				<p>{tHtml('pages/index___geen-resultaten-voor-de-geselecteerde-filters')}</p>
			)}
			{!isLoadingVisitorSpaces && visitorSpacesLength > 0 && (
				<VisitorSpaceCardList
					className={clsx('p-home__results', {
						'u-mb-64': showLoadMore,
					})}
					items={(visitorSpaces?.items || []).map(
						(room: VisitorSpaceInfo): VisitorSpaceCardProps => {
							return {
								room,
								type: VisitorSpaceCardType.noAccess, // TODO change this based on current logged in user
								onAccessRequest: () => onRequestAccess(room.slug),
							};
						}
					)}
					limit={!areAllVisitorSpacesVisible}
				/>
			)}

			{showLoadMore && (
				<div className="u-text-center">
					<Button
						className="u-font-weight-400"
						onClick={handleLoadAllVisitorSpaces}
						variants={['outline']}
					>
						{tHtml('pages/index___toon-alles-amount', {
							amount: visitorSpaces?.total,
						})}
					</Button>
				</div>
			)}
		</div>
	);
};

export default VisitorSpaceCardsWithSearch;
