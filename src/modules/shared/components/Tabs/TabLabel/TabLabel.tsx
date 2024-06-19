import { type FC } from 'react';

import { type TabLabelProps } from './TabLabel.types';

const TabLabel: FC<TabLabelProps> = ({ count, label }) => {
	return (
		<>
			<strong>{label}</strong>
			{count !== undefined && <small className="u-ml-8">({count})</small>}
		</>
	);
};

export default TabLabel;
