import React, { Component } from 'react';
import './App.css';
import Search from './Search';
import Table from './Table';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const username = 'rjohnson19';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username,
      result: null,
      searchTerm: DEFAULT_QUERY
    }

    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
  }

  setSearchTopStories(result) {
    this.setState({ result });
  }

  componentDidMount() {
    const { searchTerm } = this.state;

    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }

  onSearchChange(event) {
    this.setState({searchTerm: event.target.value});
  }

  onDismiss(id) {
    const isNotId = (item) => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);

    this.setState({
      result: { ...this.state.result, hits: updatedHits }
    });
  }

  render() {
    const {searchTerm, result, username} = this.state;
    if (!result) { return null; }

    return (
      
      <div className="page">
        <h2>Hello {username}</h2>
        <div className="interactions">
        <Search
          value={searchTerm}
          onChange={this.onSearchChange}
        >
        Search
        </Search>
        </div>
        <Table 
          list={result.hits}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
      </div>
    );
  }
}

export default App;
