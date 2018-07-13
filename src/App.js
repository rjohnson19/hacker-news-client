import React, { Component } from "react";
import "./App.css";
import Search from "./Search";
import Table from "./Table";
import Button from "./Button";

const DEFAULT_QUERY = "redux";
const DEFAULT_HITS_PER_PAGE = "100";
const DEFAULT_TAGS = "story";
const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_TAGS = "tags=";
const PARAM_PAGE = "page=";
const PARAM_HITS_PER_PAGE = "hitsPerPage=";

const username = "rjohnson19";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username,
      results: null,
      searchKey: "", // this is populated from seaarchTerm when it is submitted in onSearchSubmit()
      searchTerm: DEFAULT_QUERY, // this is the current value in the textbox, not neccesarily what is currently beind searched.
      error: null
    };

    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
  }

  needsToSearchTopStories(searchTerm) {
    // need to search results if we don't have a searchTerm in our results.
    // that includes if we don't have anything in the cache yet
    return !this.state.results || !this.state.results[searchTerm];
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;
    const oldHits =
      results && results[searchKey] ? results[searchKey].hits : [];

    const updatedHits = [...oldHits, ...hits];

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }

  componentDidMount() {
    // submit an initial search with the default term
    this.onSearchSubmit(null);
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    const baseUrlSearch = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}`;
    const filterParams = `&${PARAM_TAGS}${DEFAULT_TAGS}`;
    const pageParams = `&${PARAM_PAGE}${page}&${PARAM_HITS_PER_PAGE}${DEFAULT_HITS_PER_PAGE}`;
    fetch(`${baseUrlSearch}${searchTerm}${filterParams}${pageParams}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => this.setState({ error }));
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    if (event) {
      event.preventDefault();
    }
  }

  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }

  render() {
    const { searchTerm, results, searchKey, username, error } = this.state;
    let page =
      results && results[searchKey] && results[searchKey].page
        ? results[searchKey].page
        : 0;
    let list =
      results && results[searchKey] && results[searchKey].hits
        ? results[searchKey].hits
        : [];

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
        <Table list={list} onDismiss={this.onDismiss} />
          <div className="interactions">
            <p>Something went wrong.</p>
          </div>
        ) : (
          <Table list={list} onDismiss={this.onDismiss} />
        )}
        <div className="interactions">
          <Button
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            Next Page
          </Button>
        </div>
      </div>
    );
  }
}

export default App;
