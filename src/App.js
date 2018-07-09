import React, { Component } from 'react';
import './App.css';
import Search from './Search';
import Table from './Table';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
}, {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
}, ];

const username = 'rjohnson19';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      list,
      username,
      searchTerm: ''
    }

    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  onSearchChange(event) {
    this.setState({searchTerm: event.target.value});
  }

  onDismiss(id) {
    const isNotId = (item) => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotId);

    this.setState({
      list: updatedList
    });
  }

  render() {
    const {searchTerm, list, username} = this.state;
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
          list={list}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
      </div>
    );
  }
}

export default App;
