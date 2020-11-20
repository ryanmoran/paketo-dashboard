// @flow

import React from 'react';
import { render } from '@testing-library/react';
import Repo from '../models/repo';
import RepoList from './repo_list';
import RepoStore from '../fakes/repo_store';
import IssueStore from '../fakes/issue_store';
import PullRequestStore from '../fakes/pull_request_store';
import Timer from '../fakes/timer';

describe('RepoList', () => {
  let result, resolve;
  let store: RepoStore;
  let issueStore: IssueStore;
  let pullRequestStore: PullRequestStore;
  let timer: Timer;

  beforeEach(() => {
    store = new RepoStore();
    store.listCall.returns.promises.push(new Promise((res, rej) => { resolve = res; }));

    timer = new Timer();
    timer.setIntervalCall.returns.id = 1234;

    issueStore = new IssueStore();
    pullRequestStore = new PullRequestStore();
  });

  describe('when the promise is not resolved', () => {
    beforeEach(() => {
      result = render(
        <RepoList
          store={store}
          issueStore={issueStore}
          pullRequestStore={pullRequestStore}
          timer={timer}
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
          name: 'First Repository',
          url: 'first-url',
          openIssuesCount: 1,
        }),
        new Repo({
          name: 'Second Repository',
          url: 'second-url',
          openIssuesCount: 2,
        }),
      ]);

      result = render(
        <RepoList
          store={store}
          issueStore={issueStore}
          pullRequestStore={pullRequestStore}
          timer={timer}
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
        expect(store.listCall.callCount).toEqual(2);

        timer.setIntervalCall.receives.callback();

        expect(store.listCall.callCount).toEqual(4);
      });
    });
  });

  describe('when the component is unmounted', () => {
    beforeEach(() => {
      result = render(
        <RepoList
          store={store}
          issueStore={issueStore}
          pullRequestStore={pullRequestStore}
          timer={timer}
        />
      );

      result.unmount();
    });

    it('clears the timer interval', () => {
      expect(timer.clearIntervalCall.receives.id).toEqual(1234);
    });
  });
});
