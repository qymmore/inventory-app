const GameInstance = require("../models/gameinstance");
const Game = require("../models/game");
const { body, validationResult } = require("express-validator");
const async = require('async');

// Display list of all GameInstances.
exports.gameinstance_list = function (req, res, next) {
  GameInstance.find()
    .populate("game")
    .exec(function (err, list_gameinstances) {
      if (err) {
        return next(err);
      }
      // Successful, so render
      res.render("gameinstance_list", {
        title: "Game Instance List",
        gameinstance_list: list_gameinstances,
      });
    });
};

// Display detail page for a specific GameInstance.
exports.gameinstance_detail = (req, res, next) => {
  GameInstance.findById(req.params.id)
    .populate("game")
    .exec((err, gameinstance) => {
      if (err) {
        return next(err);
      }
      if (gameinstance == null) {
        // No results.
        const err = new Error("Game copy not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("gameinstance_detail", {
        title: `Copy: ${gameinstance.game.title}`,
        gameinstance: gameinstance,
      });
    });
};


// Display GameInstance create form on GET.
exports.gameinstance_create_get = (req, res, next) => {
  Game.find({}, "title").exec((err, games) => {
    if (err) {
      return next(err);
    }
    // Successful, so render.
    res.render("gameinstance_form", {
      title: "Create GameInstance",
      game_list: games,
    });
  });
};


// Handle GameInstance create on POST.
exports.gameinstance_create_post = [
  // Validate and sanitize fields.
  body("game", "Game must be specified").trim().isLength({ min: 1 }).escape(),
  body("status").escape(),
  body("release_date", "Invalid date").optional({ checkFalsy: true }),
  body("console").trim().isLength({ min: 1 }).escape(),
  body("price").trim().optional({ checkFalsy: true }).isNumeric(),
  body("inStock").trim().optional({ checkFalsy: true }).isNumeric(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a GameInstance object with escaped and trimmed data.
    const gameinstance = new GameInstance({
      game: req.body.game,
      status: req.body.status,
      release_date: req.body.release_date,
      console: req.body.console,
      price: req.body.price,
      inStock: req.body.inStock,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values and error messages.
      Game.find({}, "title").exec(function (err, games) {
        if (err) {
          return next(err);
        }
        // Successful, so render.
        res.render("gameinstance_form", {
          title: "Create GameInstance",
          game_list: games,
          selected_game: gameinstance.game._id,
          errors: errors.array(),
          gameinstance,
        });
      });
      return;
    } 

    // Data from form is valid.
    gameinstance.save((err) => {
      if (err) {
        return next(err);
      }
      // Successful: redirect to new record.
      res.redirect(gameinstance.url);
    });
  },
];


// Display GameInstance delete form on GET.
exports.gameinstance_delete_get = function (req, res, next) {
  GameInstance.findById(req.params.id)
    .populate("game")
    .exec(function (err, gameinstance) {
      if (err) {
        return next(err);
      }
      if (gameinstance == null) {
        // No results.
        res.redirect("/catalog/gameinstances");
      }
      // Successful, so render.
      res.render("gameinstance_delete", {
        title: "Delete GameInstance",
        gameinstance: gameinstance,
      });
    });
};


// Handle GameInstance delete on POST.
exports.gameinstance_delete_post = function (req, res, next) {
  // Assume valid GameInstance id in field.
  if(req.body.password == process.env.SECRET_PASS){
    GameInstance.findByIdAndRemove(req.body.id, function deleteGameInstance(err) {
      if (err) {
        return next(err);
      }
      // Success, so redirect to list of GameInstance items.
      res.redirect("/catalog/gameinstances");
    });
  } else {
    res.send('Access denied');
  }
};

// Display GameInstance update form on GET.
exports.gameinstance_update_get = function (req, res, next) {
  // Get game, studios and genres for form.
  async.parallel(
    {
      gameinstance: function (callback) {
        GameInstance.findById(req.params.id).populate("game").exec(callback);
      },
      games: function (callback) {
        Game.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.gameinstance == null) {
        // No results.
        var err = new Error("Game copy not found");
        err.status = 404;
        return next(err);
      }
      // Success.
      res.render("gameinstance_form", {
        title: "Update GameInstance",
        game_list: results.games,
        selected_game: results.gameinstance.game._id,
        gameinstance: results.gameinstance,
      });
    }
  );
};

// Handle gameinstance update on POST.
exports.gameinstance_update_post = [
  // Validate and sanitize fields.
  body("game", "Game must be specified").trim().isLength({ min: 1 }).escape(),
  body("status").escape(),
  body("release_date", "Invalid date").optional({ checkFalsy: true }),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a BookInstance object with escaped/trimmed data and current id.
    var gameinstance = new GameInstance({
      game: req.body.game,
      status: req.body.status,
      release_date: req.body.release_date,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors so render the form again, passing sanitized values and errors.
      Game.find({}, "title").exec(function (err, games) {
        if (err) {
          return next(err);
        }
        // Successful, so render.
        res.render("gameinstance_form", {
          title: "Update GameInstance",
          game_list: games,
          selected_game: gameinstance.game._id,
          errors: errors.array(),
          gameinstance: gameinstance,
        });
      });
      return;
    } else {
      // Data from form is valid.
      if(req.body.password == process.env.SECRET_PASS){
        GameInstance.findByIdAndUpdate(
          req.params.id,
          gameinstance,
          {},
          function (err, thegameinstance) {
            if (err) {
              return next(err);
            }
            // Successful - redirect to detail page.
            res.redirect(thegameinstance.url);
          }
        );
      } else {
        res.send('Access denied');
      }
    }
  },
];