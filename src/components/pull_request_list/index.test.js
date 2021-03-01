// @flow

import React from 'react';
import { render } from '@testing-library/react';

import PullRequestList from '.';

import PullRequest from '../../models/pull_request';
import Repo from '../../models/repo';
import User from '../../models/user';

import Cache from '../../fakes/cache';
import RepoStore from '../../fakes/repo_store';
import PullRequestStore from '../../fakes/pull_request_store';

describe('PullRequestList', () => {
  let result, resolveRepoList, resolvePullRequestList;
  let cache: Cache;
  let repoStore: RepoStore;
  let pullRequestStore: PullRequestStore;

  beforeEach(() => {
    cache = new Cache();

    repoStore = new RepoStore();
    repoStore.listCall.returns.promises.push(new Promise((res, rej) => { resolveRepoList = res }));

    pullRequestStore = new PullRequestStore();
    pullRequestStore.listCall.returns.promises.push(new Promise((res, rej) => { resolvePullRequestList = res }));
  });

  describe('when the pull requests list is not loaded', () => {
    beforeEach(() => {
      result = render(
        <PullRequestList
          cache={cache}
          repoStore={repoStore}
          pullRequestStore={pullRequestStore}
        />
      );
    });

    it('renders loading text', () => {
      const loading = result.getByText(/\.\.\./i);
      expect(loading).toBeInTheDocument();
    });
  });

  describe('when there are cached values', () => {
    beforeEach(() => {
      cache.set('/repos', {
        repos: [
          {
            name: 'first-org/first-repo',
            url: 'first-url',
            openIssuesCount: 2,
            topics: ["topic-one"]
          },
        ],
      });

      cache.set('/repos/first-org/first-repo/pull_requests', {
        pull_requests: [
          {
            id: 1111,
            number: 1,
            title: 'First Pull Request',
            user: {
              avatarURL: 'first-user-avatar-url',
            },
          },
          {
            id: 222,
            number: 2,
            title: 'Second Pull Request',
            user: {
              avatarURL: 'second-user-avatar-url',
            },
          },
        ],
      });

      result = render(
        <PullRequestList
          cache={cache}
          repoStore={repoStore}
          pullRequestStore={pullRequestStore}
        />
      );
    });

    it('renders a list of pull requests', () => {
      const first = result.getByText(/First Pull Request/i);
      expect(first).toBeInTheDocument();

      const second = result.getByText(/Second Pull Request/i);
      expect(second).toBeInTheDocument();
    });
  });

  describe('when the pull requests list is loaded', () => {
    beforeEach(() => {
      resolveRepoList([
        new Repo({
          id: 1234,
          name: 'first-org/first-repo',
          url: 'first-url',
          openIssuesCount: 2,
          topics: ["topic-one"]
        }),
      ]);

      resolvePullRequestList([
        new PullRequest({
          id: 1111,
          number: 1,
          title: 'First Pull Request',
          createdAt: '2001-01-01T01:01:01Z',
          url: 'first-url',
          user: new User({
            avatarURL: 'first-user-avatar-url',
          }),
        }),
        new PullRequest({
          id: 2222,
          number: 2,
          title: 'Second Pull Request',
          createdAt: '2002-02-02T02:02:02Z',
          url: 'second-url',
          user: new User({
            avatarURL: 'second-user-avatar-url',
          }),
        }),
      ]);

      result = render(
        <PullRequestList
          cache={cache}
          repoStore={repoStore}
          pullRequestStore={pullRequestStore}
        />
      );
    });

    it('renders a list of pull requests', () => {
      const first = result.getByText(/First Pull Request/i);
      expect(first).toBeInTheDocument();

      const second = result.getByText(/Second Pull Request/i);
      expect(second).toBeInTheDocument();
    });

    it('renders a count of the open pull requests', () => {
      const count = result.getByText(/\(2\)/i);
      expect(count).toBeInTheDocument();
    });
  });
});
