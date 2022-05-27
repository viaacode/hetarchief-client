import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { FC, useEffect, useRef, useState } from 'react';
import { StringParam, useQueryParams } from 'use-query-params';

import { SearchBar, VisitorSpaceCardList, VisitorSpaceCardProps } from '@shared/components';
import { VisitorSpaceCardType } from '@shared/components/VisitorSpaceCard';
import { SEARCH_QUERY_KEY } from '@shared/const';
import { useGetVisitorSpaces } from '@visitor-space/hooks/get-visitor-spaces';
import { VisitorSpaceInfo, VisitorSpaceStatus } from '@visitor-space/types';

const NUMBER_OF_VISITOR_SPACES = 6;

interface VisitorSpaceCardsWithSearchProps {
	onRequestAccess: (VisitorSpaceSlug: string) => void;
	onSearch?: (value?: string) => void;
}

const VisitorSpaceCardsWithSearch: FC<VisitorSpaceCardsWithSearchProps> = ({
	onRequestAccess,
	onSearch,
}) => {
	const { t } = useTranslation();
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
		!areAllVisitorSpacesVisible && (visitorSpaces?.total ?? 0) > NUMBER_OF_VISITOR_SPACES;

	/**
	 * Render
	 */

	return (
		<div className="l-container u-pt-32 u-pt-80:md u-pb-48 u-pb-80:md">
			<div id="p-home__results-anchor" ref={resultsAnchor} />
			<div className="u-flex u-flex-col u-flex-row:md u-align-center u-justify-between:md u-mb-32 u-mb-80:md">
				<h3 className="p-home__subtitle">{t('pages/index___vind-een-bezoekersruimte')}</h3>

				<SearchBar
					default={query[SEARCH_QUERY_KEY] || undefined}
					variants={['rounded', 'grey', 'icon--double', 'icon-clickable']}
					placeholder={t(
						'modules/home/components/visitor-space-cards-with-search/visitor-space-cards-with-search___zoek'
					)}
					onSearch={(value) => {
						setQuery({ [SEARCH_QUERY_KEY]: value });
						onSearch?.(value);
					}}
				/>
			</div>

			{isLoadingVisitorSpaces && <p>{t('pages/index___laden')}</p>}
			{!isLoadingVisitorSpaces && visitorSpaces?.items?.length === 0 && (
				<p>{t('pages/index___geen-resultaten-voor-de-geselecteerde-filters')}</p>
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
						{t('pages/index___toon-alles-amount', {
							amount: visitorSpaces?.total,
						})}
					</Button>
				</div>
			)}
		</div>
	);
};

export default VisitorSpaceCardsWithSearch;
