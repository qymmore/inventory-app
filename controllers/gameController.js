const Game = require("../models/game");
const Studio = require("../models/studio");
const Genre = require("../models/genre");
const GameInstance = require("../models/gameinstance");

const async = require("async");

exports.index = (req, res) => {
  async.parallel(
    {
      game_count(callback) {
        Game.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      game_instance_count(callback) {
        GameInstance.countDocuments({}, callback);
      },
      game_instance_available_count(callback) {
        GameInstance.countDocuments({ status: "Available" }, callback);
      },
      studio_count(callback) {
        Studio.countDocuments({}, callback);
      },
      genre_count(callback) {
        Genre.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render("index", {
        title: "Game Inventory Management",
        error: err,
        data: results,
      });
    }
  );
};


// Display list of all games.
exports.game_list = function (req, res, next) {
  Game.find({}, "title studio")
    .sort({ title: 1 })
    .populate("studio")
    .exec(function (err, list_games) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("game_list", { title: "Game List", game_list: list_games });
    });
};


// Display detail page for a specific game.
exports.game_detail = (req, res, next) => {
  async.parallel(
    {
      game(callback) {
        Game.findById(req.params.id)
          .populate("studio")
          .populate("genre")
          .exec(callback);
      },
      game_instance(callback) {
        GameInstance.find({ game: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.game == null) {
        // No results.
        const err = new Error("Game not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("game_detail", {
        title: results.game.title,
        game: results.game,
        game_instances: results.game_instance,
      });
    }
  );
};


// Display game create form on GET.
exports.game_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Game create GET");
};

// Handle game create on POST.
exports.game_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Game create POST");
};

// Display game delete form on GET.
exports.game_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Game delete GET");
};

// Handle game delete on POST.
exports.game_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Game delete POST");
};

// Display game update form on GET.
exports.game_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Game update GET");
};

// Handle game update on POST.
exports.game_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Game update POST");
};
