import { OrderDirection, type SelectOption } from '@meemoo/react-components';
import clsx from 'clsx';
import { type FC, useCallback, useMemo } from 'react';
import type { ActionMeta, SingleValue } from 'react-select';

import { IeObjectsService } from '@ie-objects/services';
import { tText } from '@shared/helpers/translate';
import type { AutocompleteField } from '@visitor-space/components/FilterMenu/FilterMenu.types';

import { GroupName } from '@account/const';
import { selectIsLoggedIn } from '@auth/store/user';
import type { User } from '@auth/types';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import withUser, { type UserProps } from '@shared/hooks/with-user';
import { toastService } from '@shared/services/toast-service';
import type { IeObjectsSearchFilter } from '@shared/types/ie-objects';
import { type VisitRequest, VisitStatus } from '@shared/types/visit-request';
import { useGetActiveVisitRequestForUserAndSpace } from '@visit-requests/hooks/get-active-visit-request-for-user-and-space';
import { useGetVisitRequests } from '@visit-requests/hooks/get-visit-requests';
import { VisitTimeframe } from '@visit-requests/types';
import { SEARCH_PAGE_QUERY_PARAM_CONFIG } from '@visitor-space/const';
import { SearchFilterId } from '@visitor-space/types';
import { mapFiltersToElastic, mapMaintainerToElastic } from '@visitor-space/utils/elastic-filters';
import { sortBy } from 'lodash-es';
import { useSelector } from 'react-redux';
import AsyncSelect from 'react-select/async';
import { useQueryParams } from 'use-query-params';
import styles from './AutocompleteFieldInput.module.scss';

export interface AutocompleteFieldInputProps {
	label?: string;
	fieldName: AutocompleteField;
	disabled?: boolean;
	id?: string;
	onChange: (value: string | null) => void;
	value?: string;
	className?: string;
}

const MIN_WORD_LENGTH_FOR_AUTOCOMPLETE = 3;

const AutocompleteFieldInput: FC<AutocompleteFieldInputProps & UserProps> = ({
	onChange,
	value,
	fieldName,
	label,
	user,
}) => {
	const isLoggedIn = useSelector(selectIsLoggedIn);
	const isAnonymousUser = useHasAnyGroup(GroupName.ANONYMOUS);
	const isUserWithAccount = isLoggedIn && !!user && !isAnonymousUser;
	const [query, setQuery] = useQueryParams(SEARCH_PAGE_QUERY_PARAM_CONFIG);

	const { data: visitRequestsPaginated } = useGetVisitRequests(
		{
			page: 1,
			size: 100,
			orderProp: 'startAt',
			orderDirection: OrderDirection.desc,
			status: VisitStatus.APPROVED,
			timeframe: VisitTimeframe.ACTIVE,
			personal: true,
		},
		{ enabled: !!user }
	);
	const { data: activeVisitRequest, isLoading: isLoadingActiveVisitRequest } =
		useGetActiveVisitRequestForUserAndSpace(
			query[SearchFilterId.Maintainer],
			user as unknown as User | null
		);
	const accessibleVisitorSpaceRequests: VisitRequest[] = useMemo(
		() =>
			isUserWithAccount
				? sortBy(visitRequestsPaginated?.items || [], (visitRequest) =>
						visitRequest.spaceName?.toLowerCase()
					)
				: [],
		[isUserWithAccount, visitRequestsPaginated?.items]
	);

	const handleLoadOptions = useCallback(
		(inputValue: string, callback: (newOptions: SelectOption[]) => void): void => {
			if (inputValue.length < MIN_WORD_LENGTH_FOR_AUTOCOMPLETE) {
				callback([]);
				return;
			}
			const otherFilters: IeObjectsSearchFilter[] = [
				...mapMaintainerToElastic(query, activeVisitRequest, accessibleVisitorSpaceRequests),
				...mapFiltersToElastic(query),
			];
			IeObjectsService.getAutocompleteFieldOptions(fieldName, inputValue, otherFilters)
				.then((options) => {
					callback(options.map((option) => ({ label: option, value: option })));
				})
				.catch((err) => {
					toastService.notify({
						title: tText(
							'modules/visitor-space/components/autocomplete-field-input/autocomplete-field-input___error'
						),
						description: tText(
							'modules/visitor-space/components/autocomplete-field-input/autocomplete-field-input___het-ophalen-van-de-autocomplete-suggesties-is-mislukt'
						),
					});
				});
		},
		[fieldName, query, activeVisitRequest, accessibleVisitorSpaceRequests]
	);

	const handleChange = (
		newValue: SingleValue<SelectOption>,
		actionMeta: ActionMeta<SelectOption>
	): void => {
		if (actionMeta.action === 'select-option') {
			onChange(newValue?.value || null);
		}
	};

	return (
		<AsyncSelect<SelectOption>
			aria-label={label}
			className={clsx(styles['c-autocomplete-field-input'], 'c-react-select')}
			classNamePrefix={'c-react-select'}
			defaultOptions={false}
			onChange={handleChange}
			loadOptions={handleLoadOptions}
			value={value ? { label: value, value: value } : undefined}
			placeholder={label}
			noOptionsMessage={() =>
				tText(
					'modules/visitor-space/components/autocomplete-field-input/autocomplete-field-input___geen-resultaten-gevonden'
				)
			}
			loadingMessage={() =>
				tText(
					'modules/visitor-space/components/autocomplete-field-input/autocomplete-field-input___laden'
				)
			}
		/>
	);
};

export default withUser(AutocompleteFieldInput) as FC<AutocompleteFieldInputProps>;
