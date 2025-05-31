import { GitHubRepo, GitHubUser } from '../types/github';

import { BaseAPI } from './baseAPI';

interface PaginatedResponse<T> {
  data: T[];
  hasNextPage: boolean;
  nextPage?: number;
  totalCount?: number;
}

class GitHubService extends BaseAPI {
  constructor() {
    super(process.env.REACT_APP_GITHUB_API_URL || 'https://api.github.com');
  }

  async searchUser(username: string): Promise<GitHubUser> {
    const url = this.buildUrl(`/users/${username}`);
    return this.fetchWithErrorHandling<GitHubUser>(url);
  }

  async getUserRepos(
    username: string,
    page = 1,
    perPage = 10
  ): Promise<PaginatedResponse<GitHubRepo>> {
    const url = this.buildUrl(`/users/${username}/repos`, {
      per_page: perPage,
      page,
    });

    const repos = await this.fetchWithErrorHandling<GitHubRepo[]>(url);

    return {
      data: repos,
      hasNextPage: repos.length === perPage,
      nextPage: repos.length === perPage ? page + 1 : undefined,
    };
  }
}

export const githubService = new GitHubService();
