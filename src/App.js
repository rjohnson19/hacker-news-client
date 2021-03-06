import React, { Component } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
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

const Loading = () => (
  <div>
    <FontAwesomeIcon icon={faSpinner} />
  </div>
);

const ErrorMessage = () => (
  <div className="interactions">
    <p>Something went wrong.</p>
  </div>
);

const withEither = (conditionFn, ConditionalComponent, Component) => props =>
  conditionFn(props) ? <ConditionalComponent /> : <Component {...props} />;

const isError = props => props.error;
const isLoading = props => props.isLoading;

const TableWithErrorFallback = withEither(isError, ErrorMessage, Table);

const ButtonWithLoading = withEither(isLoading, Loading, Button);

/**
 * Updates the state with search results based on the previous state's results, if any.
 * @param {*} hits
 * @param {*} page
 */
const updateSearchTopStoriesState = (hits, page) => prevState => {
  const { searchKey, results } = prevState;
  const oldHits = results && results[searchKey] ? results[searchKey].hits : [];

  const updatedHits = [...oldHits, ...hits];

  return {
    results: {
      ...results,
      [searchKey]: { hits: updatedHits, page }
    },
    isLoading: false
  };
};

class App extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      username,
      results: null,
      searchKey: "", // this is populated from seaarchTerm when it is submitted in onSearchSubmit()
      searchTerm: DEFAULT_QUERY, // this is the current value in the textbox, not neccesarily what is currently beind searched.
      error: null,
      isLoading: false
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
    this.setState(updateSearchTopStoriesState(hits, page));
  }

  componentDidMount() {
    this._isMounted = true;
    // submit an initial search with the default term
    this.onSearchSubmit(null);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({ isLoading: true });
    const baseUrlSearch = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}`;
    const filterParams = `&${PARAM_TAGS}${DEFAULT_TAGS}`;
    const pageParams = `&${PARAM_PAGE}${page}&${PARAM_HITS_PER_PAGE}${DEFAULT_HITS_PER_PAGE}`;
    axios
      .get(`${baseUrlSearch}${searchTerm}${filterParams}${pageParams}`)
      .then(result => this.setSearchTopStories(result.data))
      .catch(error => this._isMounted && this.setState({ error }));
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
    this.setState(prevState => {
      const { searchKey, results } = prevState;
      const { hits, page } = results[searchKey];

      const isNotId = item => item.objectID !== id;
      const updatedHits = hits.filter(isNotId);

      return {
        results: {
          ...results,
          [searchKey]: { hits: updatedHits, page }
        }
      };
    });
  }

  render() {
    const {
      searchTerm,
      results,
      searchKey,
      username,
      error,
      isLoading
    } = this.state;
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
        <TableWithErrorFallback
          error={error}
          list={list}
          onDismiss={this.onDismiss}
        />
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            Next Page
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

export { updateSearchTopStoriesState };
export default App;
