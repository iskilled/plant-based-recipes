import React from 'react';
import { ApolloConsumer } from 'react-apollo';

import SearchItem from './SearchItem';
import { SEARCH_RECIPES } from '../../queries';

class Search extends React.Component {

  state = {
    searchResults: []
  };

  handleChange = ({ searchRecipes }) => {
    this.setState({
      searchResults: searchRecipes
    });
  };

  render() {
    const { searchResults } = this.state;
    return (
      <ApolloConsumer >
        {client => (
          <div className="App">
            <input
              type="search"
              className="search"
              placeholder="Search for recipes 🔎"
              onChange={async event => {
                event.persist();
                const { data } = await client.query({
                  query: SEARCH_RECIPES,
                  variables: { searchTerm: event.target.value }
                });
                this.handleChange(data);
              }}
            />
            <ul className="cards">
              {searchResults.map(recipe => (
                <SearchItem  key={recipe._id} {...recipe} />
              ))}
            </ul>
          </div>
        )}
      </ApolloConsumer>
    );
  };
}

export default Search;
