import { FC } from 'react';

import { TabLabelProps } from './TabLabel.types';

const TabLabel: FC<TabLabelProps> = ({ count, label }) => {
	return (
		<>
			<strong>{label}</strong>
			{count !== undefined && <small className="u-ml-8">({count})</small>}
		</>
	);
};

export default TabLabel;
