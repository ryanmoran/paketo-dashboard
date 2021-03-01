// @flow

import React from 'react';
import { render } from '@testing-library/react';

import PullRequestItem from './pull_request_item';

import PullRequest from '../../models/pull_request';
import Repo from '../../models/repo';
import User from '../../models/user';

describe('PullRequestItem', () => {
  let result;
  let repo: Repo;
  let pullRequest: PullRequest;

  beforeEach(() => {
    repo = new Repo({
      id: 1234,
      url: 'some-repo-url',
      openIssuesCount: 1,
      name: 'some-repo',
      topics: ["topic-one"]
    });

    pullRequest = new PullRequest({
      id: 5678,
      number: 999,
      title: 'some-title',
      createdAt: '2020-01-10T12:12:12Z',
      url: 'some-pull-request-url',
      user: new User({
        avatarURL: 'some-user-avatar-url',
      }),
    });

    result = render(
      <PullRequestItem
        pullRequest={pullRequest}
        repo={repo}
      />
    );
  });

  it('renders the pull request title as a link', () => {
    const title = result.getByRole('link', { name: 'some-title' });
    expect(title).toHaveAttribute('href', 'some-pull-request-url');
  });

  it('renders the pull request number', () => {
    const number = result.getByText(/#999/i);
    expect(number).toBeInTheDocument();
  });

  it('renders the user avatar', () => {
    const avatar = result.getByRole('img', { name: 'user-avatar' });
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'some-user-avatar-url');
  });

  it('renders the pull request repo as a link', () => {
    const repo = result.getByRole('link', { name: 'some-repo' });
    expect(repo).toHaveAttribute('href', 'some-repo-url');
  });

  it('renders the creation date', () => {
    const date = result.getByText(/opened .* ago \(Jan 10, 2020\)/i);
    expect(date).toBeInTheDocument();
  });
});
