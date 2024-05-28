import { Column } from 'react-table';

import { Visit } from '@shared/types';

export interface VisitRequestOverviewProps {
	children?: React.ReactNode;
	columns: Column<Visit>[];
}
