import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
  {
    title: 'JSX',
    url: 'https://github.com/reactjs/redux',
    author: 'Some Dude',
    num_comments: 2,
    points: 5,
    objectID: 2,
  },
  {
    title: 'Ruby',
    url: 'https://github.com/reactjs/redux',
    author: 'Matz',
    num_comments: 2,
    points: 5,
    objectID: 3,
  },
];

const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,       
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  setSearchTopStories(result) {
    this.setState({ result })
  }
  
  // fetch data after component mount
  componentDidMount() {
    const { searchTerm } = this.state;
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !==id;
    
    const updatedList = this.state.list.filter(isNotId);

    // update state
    this.setState({ list: updatedList });
  }

  render() {  
    const { searchTerm, result } = this.state;

    if (!result) { return null; }

    return (
      <div className="App page">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">My React Page</h1>
        </header>

        <div className="interactions">
          <Search 
            value={searchTerm}
            onChange={this.onSearchChange}
          >
            Search:
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

const Search = ({ value, onChange, children }) =>
  <form>
    {children} <input type="text" value={value} 
    onChange={onChange} />
  </form>

const Table = ({ list, pattern, onDismiss }) =>
  <div className="table">
    {list.filter(isSearched(pattern)).map(item => 
      <div key={item.objectID} className="table-row">
        <span style={{ width: '40%' }}><a href={item.url}>{item.title}</a> </span>
        <span style={{ width: '30%' }}>{item.author} </span>
        <span style={{ width: '10%' }}> {item.num_comments} </span>
        <span style={{ width: '10%' }}>{item.points} </span>
        <span style={{ width: '20%' }}>
          <Button onClick={() => onDismiss(item.objectID)} className="button-inline">Dismiss</Button>
        </span>
      </div>
    )}
  </div>

const Button = ({ onClick, className = '', children}) =>
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>

export default App;
