# Game Inventory App

A game inventory management app created using Express and Node.js that helps clients who are video game store owners keep track of video games in their stock. 

# Tech stack
 - Express.js (API and routing)
 - Node.js (Server-side hosting and function)
 - MongoDB (Database)
 - Pug (User interface and styling)

# Specifications
The inventory app shows clients:

- Total number of games in their inventory (**Games**)
- Total number of game instances/copies of the game (**Copies available**)
- Total number of game studios (**Studio**)
- All genres of games (**Genres**)

Clients can perform the following actions:

- **Add** a new game, game instance, studio or genre
- **Delete** a game, game instance, studio or genre
- **Update** a game, game instance, studio or genre

# How to run the app

1. Clone the directory
2. Open the directory in your favorite code editor
3. Run ```DEBUG=inventory-app:* npm run devstart``` in the terminal
4. Go to `localhost:3000/catalog`

# Routes in the app

The inventory app has the following routes for accessing all the different pages:

- The **home/index page** - `catalog/`
- The **list of all games, game instances, genres, or studios** (e.g. `/catalog/games/`, `/catalog/genres/`, etc.) -
`catalog/<objects>/` 
- The **detail page** for a specific game, game instance, genre, or studio with the given _id field value .<br> 
`catalog/<object>/<id>` 
- The **form to create a new game, game instance, genre, or studio**.<br>
`catalog/<object>/create` 
- The **form to update a specific game, game instance, genre, or studio** with the given _id field value. <br>
`catalog/<object>/<id>/update` 
- The **form to delete a specific game, game instance, genre, studio** with the given _id field value. <br>
`catalog/<object>/<id>/delete`
