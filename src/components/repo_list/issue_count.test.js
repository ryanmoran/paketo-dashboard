// @flow

import React from 'react';
import { render } from '@testing-library/react';

import IssueCount from './issue_count';

import Issue from '../../models/issue';
import Repo from '../../models/repo';
import User from '../../models/user';

import IssueStore from '../../fakes/issue_store';
import Cache from '../../fakes/cache';

describe('IssueCount', () => {
  let result, resolve;
  let store: IssueStore;
  let cache: Cache;
  let repo: Repo;
  let issues: Issue[];

  beforeEach(() => {
    store = new IssueStore();
    store.listCall.returns.promises.push(new Promise((res, rej) => { resolve = res; }));

    cache = new Cache();

    repo = new Repo({
      id: 1234,
      name: 'some-org/some-repo',
      url: 'some-url',
      openIssuesCount: 3,
      topics: ["topic-one", "topic-two"]
    });

    issues = [
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
      new Issue({
        id: 3333,
        number: 3,
        title: 'Third Issue',
        url: 'third-url',
        createdAt: '2003-03-03T03:03:03Z',
        commentCount: 0,
        user: new User({
          avatarURL: 'third-user-avatar-url',
        }),
      }),
      new Issue({
        id: 4444,
        number: 4,
        title: 'Fourth Issue',
        url: 'fourth-url',
        createdAt: '2004-04-04T04:04:04Z',
        commentCount: 0,
        user: new User({
          avatarURL: 'fourth-user-avatar-url',
        }),
      }),
      new Issue({
        id: 5555,
        number: 5,
        title: 'Fifth Issue',
        url: 'fifth-url',
        createdAt: '2005-05-05T05:05:05Z',
        commentCount: 0,
        user: new User({
          avatarURL: 'fifth-user-avatar-url',
        }),
      }),
      new Issue({
        id: 6666,
        number: 6,
        title: 'Sixth Issue',
        url: 'sixth-url',
        createdAt: '2006-06-06T06:06:06Z',
        commentCount: 0,
        user: new User({
          avatarURL: 'sixth-user-avatar-url',
        }),
      }),
      new Issue({
        id: 7777,
        number: 7,
        title: 'Seventh Issue',
        url: 'seventh-url',
        createdAt: '2007-07-07T07:07:07Z',
        commentCount: 0,
        user: new User({
          avatarURL: 'seventh-user-avatar-url',
        }),
      }),
      new Issue({
        id: 8888,
        number: 8,
        title: 'Eighth Issue',
        url: 'eighth-url',
        createdAt: '2008-08-08T08:08:08Z',
        commentCount: 0,
        user: new User({
          avatarURL: 'eighth-user-avatar-url',
        }),
      }),
    ];
  });

  describe('when the promise is not resolved', () => {
    beforeEach(() => {
      result = render(
        <IssueCount
          repo={repo}
          store={store}
          cache={cache}
        />
      );
    });

    it('renders a 0 count as a link', () => {
      const loading = result.getByRole('link', { name: 'issue-count' });

      expect(loading).toHaveTextContent(/0/i);
    });
  });

  describe('when the promise is resolved', () => {
    describe('when there are 0 issues', () => {
      beforeEach(() => {
        resolve([]);

        result = render(
          <IssueCount
            repo={repo}
            store={store}
            cache={cache}
          />
        );
      });

      it('classifies the priority as none', () => {
        const count = result.getByRole('link', { name: 'issue-count' });

        expect(count).toHaveTextContent(/0/i);
        expect(count).toHaveClass('none');
      });
    });

    describe('when there are less than 4 issues', () => {
      beforeEach(() => {
        resolve(issues.slice(0, 3));

        result = render(
          <IssueCount
            repo={repo}
            store={store}
            cache={cache}
          />
        );
      });

      it('classifies the priority as low', () => {
        const count = result.getByRole('link', { name: 'issue-count' });

        expect(count).toHaveTextContent(/3/i);
        expect(count).toHaveClass('low');
      });
    });

    describe('when there are less than 7 issues', () => {
      beforeEach(() => {
        resolve(issues.slice(0, 5));

        result = render(
          <IssueCount
            repo={repo}
            store={store}
            cache={cache}
          />
        );
      });

      it('classifies the priority as medium', () => {
        const count = result.getByRole('link', { name: 'issue-count' });

        expect(count).toHaveTextContent(/5/i);
        expect(count).toHaveClass('medium');
      });
    });

    describe('when there are 7 or more issues', () => {
      beforeEach(() => {
        resolve(issues.slice(0, 8));

        result = render(
          <IssueCount
            repo={repo}
            store={store}
            cache={cache}
          />
        );
      });

      it('classifies the priority as high', () => {
        const count = result.getByRole('link', { name: 'issue-count' });

        expect(count).toHaveTextContent(/8/i);
        expect(count).toHaveClass('high');
      });
    });
  });
});
