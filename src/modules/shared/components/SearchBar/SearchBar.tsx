import { Button, keysEnter, onKey, TextInput } from '@meemoo/react-components';
import { ChangeEventHandler, FC, useEffect, useState } from 'react';

import useTranslation from '@shared/hooks/use-translation/use-translation';

import { Icon, IconNamesLight } from '../Icon';

import { SearchBarProps } from './SearchBar.types';

const SearchBar: FC<SearchBarProps> = ({
	onSearch,
	shouldReset,
	onResetFinished = () => null,
	variants = ['md', 'rounded', 'grey-border', 'icon--double', 'icon-clickable'],
	instantUpdate,
	...rest
}) => {
	const { tText } = useTranslation();
	const [search, setSearch] = useState<string | undefined>(rest.default);

	const getVariants = () => {
		let modifiers: string[] = [];

		if (typeof variants === 'string') {
			modifiers = [variants];
		} else {
			modifiers = variants;
		}

		return [...modifiers, ...(search ? ['black-border'] : [])];
	};

	const onChange = (e: any): void => {
		setSearch(e.target.value);

		if (instantUpdate) {
			onSearch(e.target.value);
		}
	};

	useEffect(() => {
		setSearch('');
		onResetFinished();
	}, [shouldReset]);

	return (
		<TextInput
			{...rest}
			value={search}
			onChange={onChange}
			variants={getVariants()}
			onKeyDown={(e) => onKey(e, [...keysEnter], () => onSearch(search))}
			iconEnd={
				<>
					{search && (
						<Button
							variants={['text', 'icon', 'xxs']}
							icon={<Icon name={IconNamesLight.Times} aria-hidden />}
							aria-label={tText(
								'modules/shared/components/search-bar/search-bar___opnieuw-instellen'
							)}
							onClick={() => {
								setSearch(undefined);
								onSearch(undefined);
							}}
						/>
					)}
					<Button
						variants={['text', 'icon', 'xxs']}
						icon={<Icon name={IconNamesLight.Search} aria-hidden />}
						aria-label={tText(
							'modules/shared/components/search-bar/search-bar___uitvoeren'
						)}
						onClick={() => onSearch(search)}
					/>
				</>
			}
		/>
	);
};

export default SearchBar;
