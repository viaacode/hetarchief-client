import { EmailTemplate } from '@shared/components/ShareFolderBlade/ShareFolderBlade.consts';
import { ApiService } from '@shared/services/api-service';

export class CampaignMonitorService {
	public static async send(json: EmailTemplate): Promise<void> {
		await ApiService.getApi().post(`campaign-monitor/send`, { json }).json();
	}
}
