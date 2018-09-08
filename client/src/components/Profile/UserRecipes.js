import React from 'react';
import { Link } from 'react-router-dom';
import { Query, Mutation } from 'react-apollo';

import {
  GET_USER_RECIPES,
  DELETE_USER_RECIPE,
  GET_ALL_RECIPES,
  GET_CURRENT_USER
} from '../../queries';
import Spinner from '../Spinner';

const handleDelete = deleteUserRecipe => {
  const confirmDelete = window.confirm('Are you sure you want to delete the recipe?');
  if (confirmDelete) {
    deleteUserRecipe();
  }
};

const UserRecipes = ({ username }) => (
  <Query
    query={GET_USER_RECIPES}
    variables={{ username }}
  >
    {({ data, loading, error }) => {
      if (loading) return <Spinner />
      if (error) return <div>Error</div>
      return (
        <ul>
          <h3>Your recipes</h3>
          {!data.getUserRecipes.length && (
            <p>
              <strong>You haven't added any recipes yet. Go ahead and add one! 
                <span role="img" aria-label="GreenSalad">🥗</span>
              </strong>
            </p>
          )}
          {data.getUserRecipes.map(recipe => (
            <li key={recipe._id}>
              <Link to={`/recipes/${recipe._id}`}><p>{recipe.name}</p></Link>
              <p style={{ marginBottom: "0" }}>Likes: {recipe.likes}</p>

              <Mutation
                mutation={DELETE_USER_RECIPE}
                variables={{ _id: recipe._id }}
                refetchQueries={() => [
                  { query: GET_ALL_RECIPES },
                  { query: GET_CURRENT_USER }
                ]}
                update={(cache, { data: { deleteUserRecipe } }) => {
                  const { getUserRecipes } = cache.readQuery({
                    query: GET_USER_RECIPES,
                    variables: { username }
                  });

                  cache.writeQuery({
                    query: GET_USER_RECIPES,
                    variables: { username },
                    data: {
                      getUserRecipes: getUserRecipes.filter(
                        recipe => recipe._id !== deleteUserRecipe._id
                      )
                    }
                  });
                }}
              >
              {(deleteUserRecipe, attrs = {}) => (
                  <p
                    className="delete-button"
                    onClick={() => handleDelete(deleteUserRecipe)}
                  >
                    {attrs.loading ? 'deleting...' : 'X'}
                  </p>
                )
              }
              </Mutation>
            </li>
          ))}
        </ul>
      );
    }}
  </Query>
);

export default UserRecipes;
