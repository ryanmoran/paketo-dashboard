// @flow

import React from 'react';
import { render } from '@testing-library/react';

import RepoItem from './repo_item';
import Repo from '../../models/repo';

import IssueStore from '../../fakes/issue_store';
import PullRequestStore from '../../fakes/pull_request_store';
import ReleaseStore from '../../fakes/release_store';
import Cache from '../../fakes/cache';

describe('RepoItem', () => {
  let result;

  beforeEach(() => {
    const repo: Repo = new Repo({
      id: 1234,
      name: 'some-org/some-repo',
      url: 'some-url',
      openIssuesCount: 3,
      topics: ["topic-one", "topic-two"]
    });

    const issueStore: IssueStore = new IssueStore();
    const pullRequestStore: PullRequestStore = new PullRequestStore();
    const releaseStore: ReleaseStore = new ReleaseStore();
    const cache = new Cache();

    result = render(
      <RepoItem
        repo={repo}
        issueStore={issueStore}
        pullRequestStore={pullRequestStore}
        releaseStore={releaseStore}
        cache={cache}
      />
    );
  });

  it('renders the name of the repository as a link', () => {
    const nameLink = result.getByRole('link', { name: 'some-repo' });
    expect(nameLink).toHaveAttribute('href', 'some-url');
  });

  it('renders the number of open issues', () => {
    const issueCount = result.getByRole('link', { name: 'issue-count' });
    expect(issueCount).toBeInTheDocument();
  });

  it('renders the number of open pull requests', () => {
    const pullRequestCount = result.getByRole('link', { name: 'pull-request-count' });
    expect(pullRequestCount).toBeInTheDocument();
  });

  it('renders the release state', () => {
    const latestRelease = result.getByRole('link', { name: 'release-state' });
    expect(latestRelease).toBeInTheDocument();
  });
});
