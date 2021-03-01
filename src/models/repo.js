// @flow

type Props = {|
  id: number,
  name: string,
  url: string,
  openIssuesCount: number,
  topics: Array<string>
|};

class Repo {
  id: number;
  name: string;
  url: string;
  openIssuesCount: number;
  topics: Array<string>;

  constructor(props: Props) {
    this.id = props.id;
    this.name = props.name;
    this.url = props.url;
    this.openIssuesCount = props.openIssuesCount;
    this.topics = props.topics
  }
}

export default Repo;
