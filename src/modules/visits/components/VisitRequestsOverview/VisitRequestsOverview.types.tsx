import { Column } from 'react-table';

import { Visit } from '@shared/types';

export interface VisitRequestOverviewProps {
	columns: Column<Visit>[];
}
