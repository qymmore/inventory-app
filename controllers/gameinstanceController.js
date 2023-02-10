const GameInstance = require("../models/gameinstance");
const Game = require("../models/game");
const { body, validationResult } = require("express-validator");

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
        gameinstance,
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

    // Create a BookInstance object with escaped and trimmed data.
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
exports.gameinstance_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: GameInstance delete GET");
};

// Handle GameInstance delete on POST.
exports.gameinstance_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: GameInstance delete POST");
};

// Display GameInstance update form on GET.
exports.gameinstance_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: GameInstance update GET");
};

// Handle gameinstance update on POST.
exports.gameinstance_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: GameInstance update POST");
};
