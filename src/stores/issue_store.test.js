// @flow

import IssueStore from './issue_store';
import GitHubClient from '../fakes/github_client';
import Issue from '../models/issue';

describe('IssueStore', () => {
  let store: IssueStore;
  let client: GitHubClient;

  beforeEach(() => {
    client = new GitHubClient();
    store = new IssueStore({ client: client });
  });

  describe('list', () => {
    beforeEach(() => {
      client.doCall.returns.responses = [
        {
          data: [
            {
              number: 1,
            },
            {
              number: 2,
              pull_request: {},
            },
          ],
          headers: {
            link: '</repos/some-org/some-repo/issues?page=2>; rel="next", </last-url>; rel="last"',
          },
        },
        {
          data: [
            {
              number: 3,
            },
          ],
          headers: {
            link: null,
          },
        }
      ]
    });

    it('returns a list of issues', async () => {
      const issues = await store.list('some-org/some-repo');

      expect(issues).toEqual([
        new Issue({ number: 1 }),
        new Issue({ number: 3 }),
      ]);

      expect(client.doCall.callCount).toEqual(2);
      expect(client.doCall.receives.requests).toHaveLength(2);
      expect(client.doCall.receives.requests[0]).toEqual({
        method: 'GET',
        path: '/repos/some-org/some-repo/issues',
      });
      expect(client.doCall.receives.requests[1]).toEqual({
        method: 'GET',
        path: '/repos/some-org/some-repo/issues?page=2',
      });
    });
  });
});