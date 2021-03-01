// @flow

import React from 'react';
import { render, cleanup } from '@testing-library/react';

import ReleaseState from './release_state';
import Release from '../../models/release';
import Repo from '../../models/repo';

import ReleaseStore from '../../fakes/release_store';
import Cache from '../../fakes/cache';

describe('ReleaseState', () => {
  let result, resolveLatestRelease;
  let repo: Repo;
  let releaseStore: ReleaseStore;
  let cache: Cache;

  beforeEach(() => {
    repo = new Repo({
      id: 1111,
      name: 'some-repo-name',
      openIssuesCount: 0,
      url: 'some-repo-url',
      topics: ["topic-one"]
    });

    releaseStore = new ReleaseStore();
    releaseStore.latestCall.returns.promise = new Promise((res, rej) => { resolveLatestRelease = res; });

    cache = new Cache();

    result = render(
      <ReleaseState
        repo={repo}
        releaseStore={releaseStore}
        cache={cache}
      />
    );
  });

  describe('when there is a cached value', () => {
    beforeEach(() => {
      cache.set('/repos/some-repo-name/releases/latest', {
        release: {
          tag: 'v1.2.3',
          commitsBehind: 2,
        },
      });

      cleanup();
      result = render(
        <ReleaseState
          repo={repo}
          releaseStore={releaseStore}
          cache={cache}
        />
      );
    });

    it('renders the node as a link to the repo releases', () => {
      const node = result.getByRole('link', { name: 'release-state' });

      expect(node).toHaveAttribute('href', 'some-repo-url/releases');
    });

    it('renders the tag of the release', () => {
      const tag = result.getByRole('generic', { name: 'tag' });
      expect(tag).toHaveTextContent(/v1\.2\.3/i);
    });

    it('renders the number of commits since the release', () => {
      const count = result.getByRole('generic', { name: 'commits-behind' });
      expect(count).toHaveTextContent(/2/i);
      expect(count).toHaveClass('behind');
    });
  });

  describe('when the promise is not resolved', () => {
    it('renders an emdash', () => {
      const tag = result.getByRole('generic', { name: 'tag' });
      expect(tag).toHaveTextContent(/—/i);
    });
  });

  describe('when the promise is resolved', () => {
    beforeEach(() => {
      resolveLatestRelease(new Release({
        tag: 'v1.2.3',
        commitsBehind: 0,
      }))

      result.rerender(
        <ReleaseState
          repo={repo}
          releaseStore={releaseStore}
          cache={cache}
        />
      );
    });

    it('renders the tag of the release', () => {
      const tag = result.getByRole('generic', { name: 'tag' });
      expect(tag).toHaveTextContent(/v1\.2\.3/i);
    });

    it('renders the number of commits since the release', () => {
      const count = result.getByRole('generic', { name: 'commits-behind' });
      expect(count).toHaveTextContent(/0/i);
      expect(count).not.toHaveClass('behind');
    });
  });
});
