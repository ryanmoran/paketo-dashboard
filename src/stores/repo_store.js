// @flow

import Repo from '../models/repo';
import { GitHubClientInterface, type GitHubClientResponse } from '../lib/github_client';

type Props = {|
  client: GitHubClientInterface,
|};

export default class RepoStore {
  props: Props;

  constructor(props: Props) {
    this.props = props;
    this.getTopics = this.getTopics.bind(this);
  }


  async list(org: string): Promise<Repo[]> {
    let repos: Repo[] = [];
    let path: string = `/orgs/${org}/repos`;

    while (path) {
      const response: GitHubClientResponse = await this.props.client.do({
        method: 'GET',
        path: path
      });

      for (const repo of response.data) {
        repos.push(new Repo({
          id: repo.id,
          name: repo.full_name,
          url: repo.html_url,
          openIssuesCount: repo.open_issues_count,
          topics: this.getTopics(org, repo.id),
        }));
      }

      path = ((response.headers.link || "").match( /<([^>]+)>;\s*rel="next"/) || [])[1];
    }


    return repos;
  }


  async getTopics(org: string, repo: string): Array<string> {
    let topics: Array<string> = [];

        const topicResponse: GitHubClientResponse = await this.props.client.do({
          method: 'GET',
          header: 'Accept: application/vnd.github.mercy-preview+json',
          path: `/repos/${org}/${repo}/topics`
        });
        topics = topicResponse.data
        console.log(topics)

    return topics
  }

}


export interface RepoStoreInterface {
  list(org: string): Promise<Repo[]>;
  // getTopics(org: string, repo: string): Array<string>
};
