import { apiService } from '@/shared/services/api.service';
import type { BulkCreateUserInput, CreatedUser } from '../types/admin.types';

class AdminUsersService {
  async bulkCreateUsers(users: BulkCreateUserInput[]): Promise<CreatedUser[]> {
    return apiService.post<CreatedUser[]>('/users/bulk', users);
  }
}

export const adminUsersService = new AdminUsersService();

