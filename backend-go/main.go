package main

import (
	"context"
	"log"
	"net/http"
	"strconv"

	"github.com/friendsofgo/graphiql"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	graphql "github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/relay"
)

var s = `
	input PokemonInput {
		name: String!
		image: String!
	}

	type Mutation {
		deletePokemon(id: Int!): Boolean!
		createPokemon(pokemon: PokemonInput!): Pokemon
	}

	type Query {
		pokemon(id: Int!): Pokemon
		pokemons(first: Int!): [Pokemon]!
	}

	type Pokemon {
		id: Int!
		number: String!
		name: String!
		image: String!
		evolutions: [Pokemon]!
	}
`

type PokemonInput struct {
	Name  string
	Image string
}

type Pokemon struct {
	id         int32
	number     string
	name       string
	image      string
	evolutions []*Pokemon
}

var pokemons []*Pokemon

type query struct{}

func (q *query) DeletePokemon(ctx context.Context, args struct{ Id int32 }) bool {
	v := []*Pokemon{}
	for _, p := range pokemons {
		if int32(p.id) != args.Id {
			v = append(v, p)
		}
	}
	pokemons = v
	return true
}

func (q *query) CreatePokemon(ctx context.Context, args struct{ Pokemon *PokemonInput }) *PokemonResolver {
	newVal := &Pokemon{
		id:     int32(len(pokemons)),
		number: strconv.Itoa(len(pokemons)),
		name:   args.Pokemon.Name,
		image:  args.Pokemon.Image,
	}
	pokemons = append(pokemons, newVal)
	return &PokemonResolver{v: newVal}
}

func (q *query) Pokemons(ctx context.Context, args struct{ First int32 }) []*PokemonResolver {
	v := []*PokemonResolver{}
	for i, p := range pokemons {
		if int32(i) >= args.First {
			break
		}
		v = append(v, &PokemonResolver{v: p})
	}
	return v
}

func (q *query) Pokemon(ctx context.Context, args struct{ Id int32 }) *PokemonResolver {
	for _, p := range pokemons {
		if p.id == args.Id {
			return &PokemonResolver{v: p}
		}
	}
	return nil
}

type PokemonResolver struct {
	v *Pokemon
}

func (r *PokemonResolver) Id() int32      { return r.v.id }
func (r *PokemonResolver) Number() string { return r.v.number }
func (r *PokemonResolver) Name() string   { return r.v.name }
func (r *PokemonResolver) Image() string  { return r.v.image }
func (r *PokemonResolver) Evolutions() []*PokemonResolver {
	er := []*PokemonResolver{}
	for _, e := range r.v.evolutions {
		er = append(er, &PokemonResolver{v: e})
	}
	return er
}

func main() {
	router := mux.NewRouter()
	schema := graphql.MustParseSchema(s, &query{})

	// init model
	pokemons = []*Pokemon{
		&Pokemon{id: 1, number: "001", name: "Bulbasaur", image: "https://img.pokemondb.net/artwork/bulbasaur.jpg"},
		&Pokemon{id: 2, number: "002", name: "Ivysaur", image: "https://img.pokemondb.net/artwork/ivysaur.jpg"},
		&Pokemon{id: 3, number: "003", name: "Venusaur", image: "https://img.pokemondb.net/artwork/venusaur.jpg"},
	}

	// First argument must be same as graphql handler path
	graphiqlHandler, err := graphiql.NewGraphiqlHandler("/query")
	if err != nil {
		panic(err)
	}
	router.Handle("/", graphiqlHandler)

	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Content-Length", "Authorization"})
	originsOk := handlers.AllowedOrigins([]string{"*"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PATCH", "PUT", "OPTIONS", "DELETE"})

	router.Handle("/query", &relay.Handler{Schema: schema})

	// Run
	log.Println("Server ready at 8080")
	log.Fatal(http.ListenAndServe(":8080", handlers.CORS(headersOk, originsOk, methodsOk)(router)))
}
