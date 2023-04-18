import { Button, keysEnter, onKey, TextInput } from '@meemoo/react-components';
import { isString } from 'lodash-es';
import { FC } from 'react';

import useTranslation from '@shared/hooks/use-translation/use-translation';

import { Icon, IconNamesLight } from '../Icon';

import { SearchBarProps } from './SearchBar.types';

const SearchBar: FC<SearchBarProps> = ({
	onSearch,
	variants = ['md', 'rounded', 'grey-border', 'icon--double', 'icon-clickable'],
	value,
	onChange,
	...rest
}) => {
	const { tText } = useTranslation();

	const getVariants = () => {
		const modifiers: string[] = isString(variants) ? [variants] : variants;
		return [...modifiers, ...(value ? ['black-border'] : [])];
	};

	return (
		<TextInput
			{...rest}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			variants={getVariants()}
			onKeyDown={(e) => onKey(e, [...keysEnter], () => onSearch(value))}
			iconEnd={
				<>
					{value && (
						<Button
							variants={['text', 'icon', 'xxs']}
							icon={<Icon name={IconNamesLight.Times} aria-hidden />}
							aria-label={tText(
								'modules/shared/components/search-bar/search-bar___opnieuw-instellen'
							)}
							onClick={() => {
								onChange('');
								onSearch('');
							}}
						/>
					)}
					<Button
						variants={['text', 'icon', 'xxs']}
						icon={<Icon name={IconNamesLight.Search} aria-hidden />}
						aria-label={tText(
							'modules/shared/components/search-bar/search-bar___uitvoeren'
						)}
						onClick={() => onSearch(value)}
					/>
				</>
			}
		/>
	);
};

export default SearchBar;
