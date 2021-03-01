// @flow

import React from 'react';
import { render } from '@testing-library/react';

import IssueList from '.';
import Repo from '../../models/repo';
import Issue from '../../models/issue';
import User from '../../models/user';

import RepoStore from '../../fakes/repo_store';
import IssueStore from '../../fakes/issue_store';
import Cache from '../../fakes/cache';

describe('IssueList', () => {
  let result, resolveRepoList, resolveIssueList;
  let repoStore: RepoStore;
  let issueStore: IssueStore;
  let cache: Cache;

  beforeEach(() => {
    repoStore = new RepoStore();
    repoStore.listCall.returns.promises.push(new Promise((res, rej) => { resolveRepoList = res }));

    issueStore = new IssueStore();
    issueStore.listCall.returns.promises.push(new Promise((res, rej) => { resolveIssueList = res }));

    cache = new Cache();
  });

  describe('when the issues list is not loaded', () => {
    beforeEach(() => {
      result = render(
        <IssueList
          repoStore={repoStore}
          issueStore={issueStore}
          cache={cache}
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

      cache.set('/repos/first-org/first-repo/issues', {
        issues: [
          {
            id: 1111,
            number: 1,
            title: 'First Issue',
            createdAt: '2001-01-01T01:01:01Z',
            user: {
              avatarURL: 'first-user-avatar-url',
            },
          },
          {
            id: 2222,
            number: 2,
            title: 'Second Issue',
            createdAt: '2002-02-02T02:02:02Z',
            user: {
              avatarURL: 'second-user-avatar-url',
            },
          },
        ],
      });

      result = render(
        <IssueList
          repoStore={repoStore}
          issueStore={issueStore}
          cache={cache}
        />
      );
    });

    it('renders a list of issues', () => {
      const first = result.getByText(/First Issue/i);
      expect(first).toBeInTheDocument();

      const second = result.getByText(/Second Issue/i);
      expect(second).toBeInTheDocument();
    });
  });

  describe('when the issues list is loaded', () => {
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

      resolveIssueList([
        new Issue({
          id: 1111,
          number: 1,
          title: 'First Issue',
          url: 'first-url',
          createdAt: '2001-01-01T01:01:01Z',
          commentCount: 0,
          user: new User({
            avatarURL: 'first-user-avatar-url',
          }),
        }),
        new Issue({
          id: 2222,
          number: 2,
          title: 'Second Issue',
          url: 'second-url',
          createdAt: '2002-02-02T02:02:02Z',
          commentCount: 0,
          user: new User({
            avatarURL: 'second-user-avatar-url',
          }),
        }),
      ]);

      result = render(
        <IssueList
          repoStore={repoStore}
          issueStore={issueStore}
          cache={cache}
        />
      );
    });

    it('renders a list of issues', () => {
      const first = result.getByText(/First Issue/i);
      expect(first).toBeInTheDocument();

      const second = result.getByText(/Second Issue/i);
      expect(second).toBeInTheDocument();
    });

    it('renders a count of the open issues', () => {
      const count = result.getByText(/\(2\)/i);
      expect(count).toBeInTheDocument();
    });
  });
});
