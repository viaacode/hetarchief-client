import { Button, keysEnter, onKey, TextInput } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import { FC, useState } from 'react';

import { Icon } from '../Icon';

import { SearchBarProps } from './SearchBar.types';

const SearchBar: FC<SearchBarProps> = ({
	onSearch,
	variants = ['md', 'rounded', 'grey-border', 'icon--double', 'icon-clickable'],
	...rest
}) => {
	const { t } = useTranslation();
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

	return (
		<TextInput
			{...rest}
			value={search}
			onChange={(e) => setSearch(e.target.value)}
			variants={getVariants()}
			onKeyDown={(e) => onKey(e, [...keysEnter], () => onSearch(search))}
			iconEnd={
				<>
					{search && (
						<Button
							variants={['text', 'icon', 'xxs']}
							icon={<Icon name="times" aria-hidden />}
							aria-label={t(
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
						icon={<Icon name="search" aria-hidden />}
						aria-label={t(
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
