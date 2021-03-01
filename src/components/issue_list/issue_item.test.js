// @flow

import React from 'react';
import { render } from '@testing-library/react';

import IssueItem from './issue_item';
import Issue from '../../models/issue';
import Repo from '../../models/repo';
import User from '../../models/user';

describe('IssueItem', () => {
  let result;
  let repo: Repo;
  let issue: Issue;

  beforeEach(() => {
    repo = new Repo({
      id: 1234,
      url: 'some-repo-url',
      openIssuesCount: 1,
      name: 'some-repo',
      topics: ["topic-one"]
    });

    issue = new Issue({
      id: 5678,
      title: 'some-title',
      number: 999,
      url: 'some-issue-url',
      createdAt: '2020-01-10T12:12:12Z',
      commentCount: 3,
      user: new User({
        avatarURL: 'some-user-avatar-url',
      }),
    });

    result = render(
      <IssueItem
        issue={issue}
        repo={repo}
      />
    );
  });

  it('renders the issue title as a link', () => {
    const title = result.getByRole('link', { name: 'some-title' });
    expect(title).toHaveAttribute('href', 'some-issue-url');
  });

  it('renders the user avatar', () => {
    const avatar = result.getByRole('img', { name: 'user-avatar' });
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'some-user-avatar-url');
  });

  it('renders the issue number', () => {
    const number = result.getByText(/#999/i);
    expect(number).toBeInTheDocument();
  });

  it('renders the issue repo as a link', () => {
    const repo = result.getByRole('link', { name: 'some-repo' });
    expect(repo).toHaveAttribute('href', 'some-repo-url');
  });

  it('renders the creation date', () => {
    const date = result.getByText(/opened .* ago \(Jan 10, 2020\)/i);
    expect(date).toBeInTheDocument();
  });

  describe('when there are comments', () => {
    beforeEach(() => {
      issue = new Issue({
        id: 5678,
        title: 'some-title',
        number: 999,
        url: 'some-url',
        createdAt: '2020-01-10T12:12:12Z',
        commentCount: 5,
        user: new User({
          avatarURL: 'some-user-avatar-url',
        }),
      });

      result.rerender(
        <IssueItem
          issue={issue}
          repo={repo}
        />
      );
    });

    it('renders the number of comments', () => {
        const commentCount = result.getByRole('generic', { name: 'comment-count' });
        expect(commentCount).toHaveTextContent(/5/i);
        expect(commentCount).not.toHaveClass('none');
    });
  });

  describe('when there are no comments', () => {
    beforeEach(() => {
      issue = new Issue({
        id: 5678,
        title: 'some-title',
        number: 999,
        url: 'some-url',
        createdAt: '2020-01-10T12:12:12Z',
        commentCount: 0,
        user: new User({
          avatarURL: 'some-user-avatar-url',
        }),
      });

      result.rerender(
        <IssueItem
          issue={issue}
          repo={repo}
        />
      );
    });

    it('does not render the number of comments', () => {
        const commentCount = result.getByRole('generic', { name: 'comment-count' });
        expect(commentCount).toHaveTextContent(/0/i);
        expect(commentCount).toHaveClass('none');
    });
  });
});
