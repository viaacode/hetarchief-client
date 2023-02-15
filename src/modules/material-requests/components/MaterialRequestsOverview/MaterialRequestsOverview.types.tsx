import { Column } from 'react-table';

import { MaterialRequest } from 'modules/material-requests/types';

export interface MaterialRequestsOverviewProps {
	columns: Column<MaterialRequest>[];
}

export type MaterialRequestRow = { row: { original: MaterialRequest } };
