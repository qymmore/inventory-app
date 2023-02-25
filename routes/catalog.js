const express = require("express");
const router = express.Router();

// Require controller modules.
const game_controller = require("../controllers/gameController");
const studio_controller = require("../controllers/studioController");
const genre_controller = require("../controllers/genreController");
const game_instance_controller = require("../controllers/gameinstanceController");

/// GAME ROUTES ///

// GET catalog home page.
router.get("/", game_controller.index);

// GET request for creating a Game. NOTE This must come before routes that display Game (uses id).
router.get("/game/create", game_controller.game_create_get);

// POST request for creating Game.
router.post("/game/create", game_controller.game_create_post);

// GET request to delete Game.
router.get("/game/:id/delete", game_controller.game_delete_get);

// POST request to delete Game.
router.post("/game/:id/delete", game_controller.game_delete_post);

// GET request to update Game.
router.get("/game/:id/update", game_controller.game_update_get);

// POST request to update Game.
router.post("/game/:id/update", game_controller.game_update_post);

// GET request for one Game.
router.get("/game/:id", game_controller.game_detail);

// GET request for list of all Game items.
router.get("/games", game_controller.game_list);

/// STUDIO ROUTES ///

// GET request for creating Studio. NOTE This must come before route for id (i.e. display studio).
router.get("/studio/create", studio_controller.studio_create_get);

// POST request for creating Studio.
router.post("/studio/create", studio_controller.studio_create_post);

// GET request to delete Studio.
router.get("/studio/:id/delete", studio_controller.studio_delete_get);

// POST request to delete Studio.
router.post("/studio/:id/delete", studio_controller.studio_delete_post);

// GET request to update Studio.
router.get("/studio/:id/update", studio_controller.studio_update_get);

// POST request to update Studio.
router.post("/studio/:id/update", studio_controller.studio_update_post);

// GET request for one Studio.
router.get("/studio/:id", studio_controller.studio_detail);

// GET request for list of all Studios.
router.get("/studios", studio_controller.studio_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get("/genre/create", genre_controller.genre_create_get);

//POST request for creating Genre.
router.post("/genre/create", genre_controller.genre_create_post);

// GET request to delete Genre.
router.get("/genre/:id/delete", genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post("/genre/:id/delete", genre_controller.genre_delete_post);

// GET request to update Genre.
router.get("/genre/:id/update", genre_controller.genre_update_get);

// POST request to update Genre.
router.post("/genre/:id/update", genre_controller.genre_update_post);

// GET request for one Genre.
router.get("/genre/:id", genre_controller.genre_detail);

// GET request for list of all Genre.
router.get("/genres", genre_controller.genre_list);

/// GAMEINSTANCE ROUTES ///

// GET request for creating a GameInstance. NOTE This must come before route that displays GameInstance (uses id).
router.get(
  "/gameinstance/create", game_instance_controller.gameinstance_create_get
);

// POST request for creating GameInstance.
router.post(
  "/gameinstance/create",
  game_instance_controller.gameinstance_create_post
);

// GET request to delete GameInstance.
router.get(
  "/gameinstance/:id/delete",
  game_instance_controller.gameinstance_delete_get
);

// POST request to delete GameInstance.
router.post(
  "/gameinstance/:id/delete",
  game_instance_controller.gameinstance_delete_post
);

// GET request to update GameInstance.
router.get(
  "/gameinstance/:id/update",
  game_instance_controller.gameinstance_update_get
);

// POST request to update GameInstance.
router.post(
  "/gameinstance/:id/update",
  game_instance_controller.gameinstance_update_post
);

// GET request for one GameInstance.
router.get("/gameinstance/:id", game_instance_controller.gameinstance_detail);

// GET request for list of all GameInstance.
router.get("/gameinstances", game_instance_controller.gameinstance_list);

module.exports = router;
