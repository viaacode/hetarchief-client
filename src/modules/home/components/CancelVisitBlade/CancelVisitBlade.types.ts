import { FormBladeProps } from '@shared/types';

import { ProcessVisitBladeProps } from '../ProcessVisitBlade/ProcessVisitBlade.types';

export type CancelVisitBladeProps = FormBladeProps<Record<string, never>> & ProcessVisitBladeProps;
