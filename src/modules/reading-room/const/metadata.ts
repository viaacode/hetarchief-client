import {
	DatepickerProps,
	ReactSelect,
	ReactSelectProps,
	TextInput,
	TextInputProps,
} from '@meemoo/react-components';
import { i18n } from 'next-i18next';
import { FC } from 'react';

import { DateRangeInput } from '@reading-room/components/DateRangeInput';
import { DurationInput } from '@reading-room/components/DurationInput';
import { MetadataProp } from '@reading-room/types';
import { Operator } from '@shared/types';

import { DateInput } from '../components/DateInput';
import { DurationRangeInput } from '../components/DurationRangeInput';
import { MediaTypeSelect } from '../components/MediaTypeSelect';

export type MetadataFields = FC<TextInputProps> | FC<ReactSelectProps> | FC<DatepickerProps>;

export type MetadataConfig = {
	[key in MetadataProp]?: {
		[key in Operator]?: {
			label: string;
			field: MetadataFields;
		};
	};
};

export const METADATA_CONFIG = (): MetadataConfig => {
	const dictionary = {
		from:
			i18n?.t(
				'modules/reading-room/components/advanced-filter-fields/advanced-filter-fields___vanaf'
			) ?? '',
		until:
			i18n?.t(
				'modules/reading-room/components/advanced-filter-fields/advanced-filter-fields___tot-en-met'
			) ?? '',
		between:
			i18n?.t(
				'modules/reading-room/components/advanced-filter-fields/advanced-filter-fields___tussen'
			) ?? '',
		contains:
			i18n?.t(
				'modules/reading-room/components/advanced-filter-fields/advanced-filter-fields___bevat'
			) ?? '',
		excludes:
			i18n?.t(
				'modules/reading-room/components/advanced-filter-fields/advanced-filter-fields___bevat-niet'
			) ?? '',
		equals:
			i18n?.t(
				'modules/reading-room/components/advanced-filter-fields/advanced-filter-fields___is'
			) ?? '',
		differs:
			i18n?.t(
				'modules/reading-room/components/advanced-filter-fields/advanced-filter-fields___is-niet'
			) ?? '',
		shorter:
			i18n?.t(
				'modules/reading-room/components/advanced-filter-fields/advanced-filter-fields___korter-dan'
			) ?? '',
		longer:
			i18n?.t(
				'modules/reading-room/components/advanced-filter-fields/advanced-filter-fields___langer-dan'
			) ?? '',
	};

	return {
		[MetadataProp.Carrier]: {
			[Operator.Equals]: {
				label: dictionary.equals,
				field: ReactSelect, // TODO: CarrierSelect
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: ReactSelect, // TODO: CarrierSelect
			},
		},
		[MetadataProp.CreatedAt]: {
			[Operator.GreaterThan]: {
				label: dictionary.from,
				field: DateInput,
			},
			[Operator.LessThanOrEqual]: {
				label: dictionary.until,
				field: DateInput,
			},
			[Operator.Between]: {
				label: dictionary.between,
				field: DateRangeInput,
			},
		},
		[MetadataProp.Creator]: {
			[Operator.Contains]: {
				label: dictionary.contains,
				field: TextInput,
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
			},
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: TextInput,
			},
		},
		[MetadataProp.Description]: {
			[Operator.Contains]: {
				label: dictionary.contains,
				field: TextInput,
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
			},
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: TextInput,
			},
		},
		[MetadataProp.Duration]: {
			[Operator.LessThanOrEqual]: {
				label: dictionary.shorter,
				field: DurationInput,
			},
			[Operator.GreaterThan]: {
				label: dictionary.longer,
				field: DurationInput,
			},
			[Operator.Between]: {
				label: dictionary.between,
				field: DurationRangeInput,
			},
		},
		[MetadataProp.Era]: {
			[Operator.Contains]: {
				label: dictionary.contains,
				field: TextInput,
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
			},
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: TextInput,
			},
		},
		[MetadataProp.Everything]: {
			[Operator.Contains]: {
				label: dictionary.contains,
				field: TextInput,
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
			},
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: TextInput,
			},
		},
		[MetadataProp.Mediatype]: {
			[Operator.Equals]: {
				label: dictionary.equals,
				field: MediaTypeSelect,
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: MediaTypeSelect,
			},
		},
		[MetadataProp.Genre]: {
			[Operator.Equals]: {
				label: dictionary.equals,
				field: ReactSelect, // TODO: GenreSelect
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: ReactSelect, // TODO: GenreSelect
			},
		},
		[MetadataProp.Language]: {
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: TextInput,
			},
		},
		[MetadataProp.Location]: {
			[Operator.Contains]: {
				label: dictionary.contains,
				field: TextInput,
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
			},
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: TextInput,
			},
		},
		[MetadataProp.PublishedAt]: {
			[Operator.GreaterThan]: {
				label: dictionary.from,
				field: DateInput,
			},
			[Operator.LessThanOrEqual]: {
				label: dictionary.until,
				field: DateInput,
			},
			[Operator.Between]: {
				label: dictionary.between,
				field: DateRangeInput,
			},
		},
		[MetadataProp.Publisher]: {
			[Operator.Contains]: {
				label: dictionary.contains,
				field: TextInput,
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
			},
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: TextInput,
			},
		},
		[MetadataProp.Title]: {
			[Operator.Contains]: {
				label: dictionary.contains,
				field: TextInput,
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
			},
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: TextInput,
			},
		},
	};
};
