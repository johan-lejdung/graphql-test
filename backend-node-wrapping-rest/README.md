Follow: https://medium.com/@joeynimu/wrapping-a-rest-api-in-graphql-f50c7b9669d5

This is an example of how you can easily wrap a REST API in GraphQL

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
  People {
    name
    gender
    vehicles
    films
    species
    starships
  }
}
```

**Get single**
```
{
  Person(id:"1"){
    name
    gender
    vehicles
    films
    species
    starships
  }
}
```
