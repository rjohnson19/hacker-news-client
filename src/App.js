import React, { Component } from 'react';
import './App.css';
import Search from './Search';
import Table from './Table';
import Button from './Button';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HITS_PER_PAGE = '100';
const DEFAULT_TAGS = 'story';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_TAGS = 'tags=';
const PARAM_PAGE = 'page=';
const PARAM_HITS_PER_PAGE = 'hitsPerPage='

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
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const oldHits = page !== 0
      ? this.state.result.hits
      : [];

    const updatedHits = [
      ...oldHits, ...hits
    ];
      
    this.setState({ 
      result: { hits: updatedHits, page } 
    });
  }

  componentDidMount() {
    // submit an initial search with the default term
    this.onSearchSubmit(null);
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    const baseUrlSearch = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}`;
    const filterParams = `&${PARAM_TAGS}${DEFAULT_TAGS}`
    const pageParams = `&${PARAM_PAGE}${page}&${PARAM_HITS_PER_PAGE}${DEFAULT_HITS_PER_PAGE}`;
    fetch(`${baseUrlSearch}${searchTerm}${filterParams}${pageParams}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }

  onSearchChange(event) {
    this.setState({searchTerm: event.target.value});
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    if (event) {
      event.preventDefault();
    }
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
    let page = 0;
    if (result && result.page) {
      page = result.page;
    }

    return (
      
      <div className="page">
        <h2>Hello {username}</h2>
        <div className="interactions">
        <Search
          value={searchTerm}
          onChange={this.onSearchChange}
          onSubmit={this.onSearchSubmit}
        >
        Search
        </Search>
        </div>
        { result &&
         <Table 
            list={result.hits}
            onDismiss={this.onDismiss}
          />
        }
        <div class="interactions">
          <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
          Next Page
          </Button>
        </div>
        
      </div>
    );
  }
}

export default App;
