import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";

import logo from './logo.svg';
import './App.css';

// Build from https://www.sitepoint.com/how-to-build-a-web-app-with-graphql-and-react/
const GET_POKEMON_INFO = gql`
  {
    pokemons(first: 50) {
      id,
      number,
      name,
      image,
      evolutions {
        id,
        number,
        name,
        image
      }
    }
  }
`;


function App() {
  const { data, loading, err } = useQuery(GET_POKEMON_INFO);

  if (loading) return <>Loading...</>;
  if (err) return <>Error: {err}</>;
  if (!data) return <>Error: No data</>;

  return (
    <div className="App">
      <header className="App-header">
        <div  style={{
          display: "flex",
          justifyContent: 'center',
          flexDirection: "column",
          alignItems: "center",
        }}>
          {
            data.pokemons.map((pokemon, index) => (
              <div key={index} style={{
                margin: "5px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}>
                <img src={pokemon.image} style={{
                  maxWidth: "150px",
                  maxHeight: "150px",
                  width: "auto",
                  height: "auto"
                }} />
                <p>{`#${pokemon.number} / ${pokemon.name}`}</p>
              </div>
            ))
          }
        </div>
      </header>
    </div>
  );
}

export default App;
