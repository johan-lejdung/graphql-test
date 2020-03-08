import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLSchema,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLNonNull,
    GraphQLInputObjectType
  } from 'graphql';

  let pokemons = [
    {id: 1, number: "001", name: "Bulbasaur", image: "https://img.pokemondb.net/artwork/bulbasaur.jpg"},
    {id: 2, number: "002", name: "Ivysaur", image: "https://img.pokemondb.net/artwork/ivysaur.jpg"},
    {id: 3, number: "003", name: "Venusaur", image: "https://img.pokemondb.net/artwork/venusaur.jpg"},
  ]

  const PokemonInput = new GraphQLInputObjectType({
    name: 'PokemonInput',
    description: 'A pokemoninput type',
    fields: () => ({
      name: {
        type: GraphQLString,
        description: 'A pokemons name'
      },
      image: {
        type: GraphQLString,
        description: 'A pokemons image uri'
      }
    })
  });

  const PokemonType = new GraphQLObjectType({
    name: 'Pokemon',
    description: 'A pokemon',
    fields: () => ({
      id: {
        type: GraphQLInt,
        description: "The pokemons id",
        resolve: (p) => p.id
      },
      number: {
        type: GraphQLString,
        description: 'A pokemons number',
        resolve: (p) => p.number
      },
      name: {
        type: GraphQLString,
        description: 'A pokemons name',
        resolve: (p) => p.name
      },
      image: {
        type: GraphQLString,
        description: 'A pokemons image uri',
        resolve: (p) => p.image
      },
      evolutions: {
        type: new GraphQLList(PokemonType),
        description: 'A list<Array> of evolutions by the pokemon',
        resolve: (p) => p.evolutions
      }
    })
  });

  const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root query of all',
    fields: () => ({
      pokemons: {
        type: new GraphQLList(PokemonType),
        args: {
          first: {
            type: GraphQLInt
          }
        },
        description: 'All pokemons',
        resolve: (root, args) => (
           pokemons.slice(0, args.first)
        )
      },
      pokemon: {
        type: PokemonType,
        args: {
          id: {
            type: GraphQLInt
          }
        },
        resolve: (root, args) => {
          return pokemons.find(p => p.id = args.id)
        }
        }
    })
  })

  const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      deletePokemon: {
        type: GraphQLBoolean,
        args: {
          id: { type: GraphQLNonNull(GraphQLInt) },
        },
        resolve: async (root, args) => {
          pokemons = pokemons.filter(p => p.id != args.id)
          return true
        }
      },
      createPokemon: {
        type: PokemonType,
        args: {
          pokemon: { type: GraphQLNonNull(PokemonInput) },
        },
        resolve: async (root, args) => {
          let newId = pokemons.length+1
          let newval = {
            id: newId,
            number: newId.toString(),
            name: args.pokemon.name,
            image: args.pokemon.image,
            evolutions: []
          }
          pokemons.push(newval)
          return newval
        }
      }
    })
  })

  export default new GraphQLSchema({
    query: QueryType,
    mutation: MutationType
  });
