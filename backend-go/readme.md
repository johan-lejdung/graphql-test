# GraphQL-Go

Using: https://github.com/graph-gophers/graphql-go

Half-followed: https://itnext.io/making-a-simple-graphql-server-with-go-dcb9b60460c6

Information: https://graphql.org/learn/schema/

# Run

```
go run main.go
```

Try out some queries by starting the frontend or navigating to:
```
localhost:8080
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
