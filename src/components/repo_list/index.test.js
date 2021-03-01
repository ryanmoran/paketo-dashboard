// @flow

import React from 'react';
import { render } from '@testing-library/react';

import Repo from '../../models/repo';
import RepoList from '.';

import RepoStore from '../../fakes/repo_store';
import IssueStore from '../../fakes/issue_store';
import PullRequestStore from '../../fakes/pull_request_store';
import ReleaseStore from '../../fakes/release_store';
import Timer from '../../fakes/timer';
import Cache from '../../fakes/cache';

describe('RepoList', () => {
  let result, resolve;
  let repoStore: RepoStore;
  let issueStore: IssueStore;
  let pullRequestStore: PullRequestStore;
  let releaseStore: ReleaseStore;
  let timer: Timer;
  let cache: Cache;

  beforeEach(() => {
    repoStore = new RepoStore();
    repoStore.listCall.returns.promises.push(new Promise((res, rej) => { resolve = res; }));

    timer = new Timer();
    timer.setIntervalCall.returns.id = 1234;

    issueStore = new IssueStore();
    pullRequestStore = new PullRequestStore();
    releaseStore = new ReleaseStore();
    cache = new Cache();
  });

  describe('when the promise is not resolved', () => {
    beforeEach(() => {
      result = render(
        <RepoList
          repoStore={repoStore}
          issueStore={issueStore}
          pullRequestStore={pullRequestStore}
          releaseStore={releaseStore}
          timer={timer}
          cache={cache}
        />
      );
    });

    it('renders loading text', () => {
      const loading = result.getByText(/\.\.\./i);

      expect(loading).toBeInTheDocument();
    });
  });

  describe('when the promise is resolved', () => {
    beforeEach(() => {
      resolve([
        new Repo({
          id: 1234,
          name: 'First Repository',
          url: 'first-url',
          openIssuesCount: 1,
          topics: ["topic-one"]
        }),
        new Repo({
          id: 2345,
          name: 'Second Repository',
          url: 'second-url',
          openIssuesCount: 2,
          topics: ["topic-one", "topic-two"]
        }),
      ]);

      result = render(
        <RepoList
          repoStore={repoStore}
          issueStore={issueStore}
          pullRequestStore={pullRequestStore}
          releaseStore={releaseStore}
          timer={timer}
          cache={cache}
        />
      );
    });

    it('renders a list of repos', () => {
      const first = result.getByText(/First Repository/i);
      expect(first).toBeInTheDocument();

      const second = result.getByText(/Second Repository/i);
      expect(second).toBeInTheDocument();
    });

    describe('when the timer goes off', () => {
      it('updates the list', () => {
        const fifteenMinutes = 900000;

        expect(timer.setIntervalCall.receives.interval).toEqual(fifteenMinutes);
        expect(repoStore.listCall.callCount).toEqual(2);

        timer.setIntervalCall.receives.callback();

        expect(repoStore.listCall.callCount).toEqual(4);
      });
    });
  });

  describe('when the component is unmounted', () => {
    beforeEach(() => {
      result = render(
        <RepoList
          repoStore={repoStore}
          issueStore={issueStore}
          pullRequestStore={pullRequestStore}
          releaseStore={releaseStore}
          timer={timer}
          cache={cache}
        />
      );

      result.unmount();
    });

    it('clears the timer interval', () => {
      expect(timer.clearIntervalCall.receives.id).toEqual(1234);
    });
  });
});
