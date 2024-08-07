import { type ReactNode } from 'react';
import { type Column } from 'react-table';

import { type Visit } from '@shared/types';

export interface VisitRequestOverviewProps {
	children?: ReactNode;
	columns: Column<Visit>[];
}
