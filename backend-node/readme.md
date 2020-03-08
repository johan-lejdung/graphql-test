# GraphQL-Node

Took structure from: https://medium.com/@joeynimu/wrapping-a-rest-api-in-graphql-f50c7b9669d5

More information: https://snipcart.com/blog/graphql-nodejs-express-tutorial

# Install

```
npm install
```

# Run

```
npm run start
```

Try out some queries by starting the frontend or navigating to:
```
localhost:5000
```

examples queries

**Get multiple**
```
{
  pokemons(first: 2) {
    id
    name
    number
    image
    evolutions {
      name
    }
  }
}
```

**Get single**
```
{
  pokemon(id: 2) {
    id
    name
    number
    image
    evolutions {
      name
    }
  }
}
```

**Create new**
```
mutation {
  createPokemon(pokemon: {name: "Johanisaur", image: "image"}) {
    id
    name
  }
}
```

**Delete**
```
mutation {
  deletePokemon(id: 2)
}
```
