// @flow

import React from 'react';
import type { Node } from 'react';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from './lib/private_route';

import '../styles/app.css';

import Header from './header';
import Login from './login';
import RepoList from './repo_list';

import { RepoStoreInterface } from '../stores/repo_store';
import { IssueStoreInterface } from '../stores/issue_store';
import { PullRequestStoreInterface } from '../stores/pull_request_store';
import { TimerInterface } from '../lib/timer';
import { CacheInterface } from '../lib/cache';
import { StorageInterface } from '../lib/storage';

type Props = {|
  repoStore: RepoStoreInterface,
  issueStore: IssueStoreInterface,
  pullRequestStore: PullRequestStoreInterface,
  timer: TimerInterface,
  cache: CacheInterface,
  storage: StorageInterface,
|};

type State = {|
  authenticated: boolean,
|};

class App extends React.Component<Props, State> {
  assignToken: string => void;

  constructor(props: Props) {
    super(props);

    this.state = { authenticated: !!this.props.storage.getItem('token') };

    this.assignToken = this.assignToken.bind(this);
  }

  assignToken(token: string): void {
    this.props.storage.setItem('token', token);
    this.setState({ authenticated: !!this.props.storage.getItem('token') });
  }

  render(): Node {
    let root = '';
    if (process.env.PUBLIC_URL) {
      root = process.env.PUBLIC_URL;
    }

    return (
      <div className="app">
        <Header />
        <section className="body">
          <Switch>

            <Route path={`${root}/login`} render={({ history, location }) =>
              <Login
                assignToken={this.assignToken}
                history={history}
                location={location}
              />}
            />

            <PrivateRoute path={`${root}/`} authenticated={this.state.authenticated}>
              <RepoList
                store={this.props.repoStore}
                issueStore={this.props.issueStore}
                pullRequestStore={this.props.pullRequestStore}
                timer={this.props.timer}
                cache={this.props.cache}
              />
            </PrivateRoute>

          </Switch>
        </section>
      </div>
    );
  }
}

export default App;