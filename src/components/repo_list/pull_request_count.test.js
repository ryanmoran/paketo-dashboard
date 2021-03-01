// @flow

import React from 'react';
import { render } from '@testing-library/react';

import PullRequestCount from './pull_request_count';

import PullRequest from '../../models/pull_request';
import Repo from '../../models/repo';
import User from '../../models/user';

import PullRequestStore from '../../fakes/pull_request_store';
import Cache from '../../fakes/cache';

describe('PullRequestCount', () => {
  let result, resolve;
  let store: PullRequestStore;
  let cache: Cache;
  let repo: Repo;
  let pullRequests: PullRequest[];

  beforeEach(() => {
    store = new PullRequestStore();
    store.listCall.returns.promises.push(new Promise((res, rej) => { resolve = res; }));

    cache = new Cache();

    repo = new Repo({
      id: 1234,
      name: 'some-org/some-repo',
      url: 'some-url',
      openIssuesCount: 3,
      topics: ["topic-one", "topic-two"]
    });

    pullRequests = [
      new PullRequest({
        id: 1111,
        number: 1,
        title: 'First PR',
        createdAt: '2001-01-01T01:01:01Z',
        url: 'first-url',
        user: new User({
          avatarURL: 'first-user-avatar-url',
        }),
      }),
      new PullRequest({
        id: 2222,
        number: 2,
        title: 'Second PR',
        createdAt: '2002-02-02T02:02:02Z',
        url: 'second-url',
        user: new User({
          avatarURL: 'second-user-avatar-url',
        }),
      }),
      new PullRequest({
        id: 3333,
        number: 3,
        title: 'Third PR',
        createdAt: '2003-03-03T03:03:03Z',
        url: 'third-url',
        user: new User({
          avatarURL: 'third-user-avatar-url',
        }),
      }),
      new PullRequest({
        id: 4444,
        number: 4,
        title: 'Fourth PR',
        createdAt: '2004-04-04T04:04:04Z',
        url: 'fourth-url',
        user: new User({
          avatarURL: 'fourth-user-avatar-url',
        }),
      }),
      new PullRequest({
        id: 5555,
        number: 5,
        title: 'Fifth PR',
        createdAt: '2005-05-05T05:05:05Z',
        url: 'fifth-url',
        user: new User({
          avatarURL: 'fifth-user-avatar-url',
        }),
      }),
      new PullRequest({
        id: 6666,
        number: 6,
        title: 'Sixth PR',
        createdAt: '2006-06-06T06:06:06Z',
        url: 'sixth-url',
        user: new User({
          avatarURL: 'sixth-user-avatar-url',
        }),
      }),
      new PullRequest({
        id: 7777,
        number: 7,
        title: 'Seventh PR',
        createdAt: '2007-07-07T07:07:07Z',
        url: 'seventh-url',
        user: new User({
          avatarURL: 'seventh-user-avatar-url',
        }),
      }),
      new PullRequest({
        id: 8888,
        number: 8,
        title: 'Eighth PR',
        createdAt: '2008-08-08T08:08:08Z',
        url: 'eighth-url',
        user: new User({
          avatarURL: 'eighth-user-avatar-url',
        }),
      }),
    ]
  });

  describe('when the promise is not resolved', () => {
    beforeEach(() => {
      result = render(
        <PullRequestCount
          repo={repo}
          store={store}
          cache={cache}
        />
      );
    });

    it('renders a zero count as a link', () => {
      const count = result.getByRole('link', { name: 'pull-request-count' })
      expect(count).toHaveTextContent(/0/i);
      expect(count).toHaveAttribute('href', 'some-url/pulls');
    });
  });

  describe('when the promise is resolved', () => {
    describe('when there are 0 pull requests', () => {
      beforeEach(() => {
        resolve([]);

        result = render(
          <PullRequestCount
            repo={repo}
            store={store}
            cache={cache}
          />
        );
      });

      it('classifies the priority as low', () => {
        const count = result.getByRole('link', { name: 'pull-request-count' })

        expect(count).toHaveTextContent(/0/i);
        expect(count).toHaveClass('none');
      });
    });

    describe('when there are less than 4 pull requests', () => {
      beforeEach(() => {
        resolve(pullRequests.slice(0,3));

        result = render(
          <PullRequestCount
            repo={repo}
            store={store}
            cache={cache}
          />
        );
      });

      it('classifies the priority as low', () => {
        const count = result.getByRole('link', { name: 'pull-request-count' });

        expect(count).toHaveTextContent(/3/i);
        expect(count).toHaveClass('low');
      });
    });

    describe('when there are less than 7 pull requests', () => {
      beforeEach(() => {
        resolve(pullRequests.slice(0,5));

        result = render(
          <PullRequestCount
            repo={repo}
            store={store}
            cache={cache}
          />
        );
      });

      it('classifies the priority as medium', () => {
        const count = result.getByRole('link', { name: 'pull-request-count' });

        expect(count).toHaveTextContent(/5/i);
        expect(count).toHaveClass('medium');
      });
    });

    describe('when there are 7 or more pull requests', () => {
      beforeEach(() => {
        resolve(pullRequests.slice(0, 8));

        result = render(
          <PullRequestCount
            repo={repo}
            store={store}
            cache={cache}
          />
        );
      });

      it('classifies the priority as high', () => {
        const count = result.getByRole('link', { name: 'pull-request-count' });

        expect(count).toHaveTextContent(/8/i);
        expect(count).toHaveClass('high');
      });
    });
  });
});
