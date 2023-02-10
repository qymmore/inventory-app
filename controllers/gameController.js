const Game = require("../models/game");
const Studio = require("../models/studio");
const Genre = require("../models/genre");
const GameInstance = require("../models/gameinstance");
const { body, validationResult } = require("express-validator");

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
exports.game_create_get = (req, res, next) => {
  // Get all authors and genres, which we can use for adding to our book.
  async.parallel(
    {
      studios(callback) {
        Studio.find(callback);
      },
      genres(callback) {
        Genre.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("game_form", {
        title: "Create Game",
        studios: results.studios,
        genres: results.genres,
      });
    }
  );
};


// Handle game create on POST.
exports.game_create_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },

  // Validate and sanitize fields.
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("studio", "Studio must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("genre.*").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Game object with escaped and trimmed data.
    const game = new Game({
      title: req.body.title,
      studio: req.body.studio,
      summary: req.body.summary,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      async.parallel(
        {
          studios(callback) {
            Studio.find(callback);
          },
          genres(callback) {
            Genre.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          // Mark our selected genres as checked.
          for (const genre of results.genres) {
            if (game.genre.includes(genre._id)) {
              genre.checked = "true";
            }
          }
          res.render("game_form", {
            title: "Create Game",
            studios: results.studios,
            genres: results.genres,
            game,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Data from form is valid. Save book.
    game.save((err) => {
      if (err) {
        return next(err);
      }
      // Successful: redirect to new book record.
      res.redirect(game.url);
    });
  },
];


// Display game delete form on GET.
exports.game_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Game delete GET");
};

// Handle game delete on POST.
exports.game_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Game delete POST");
};

// Display game update form on GET.
exports.game_update_get = (req, res, next) => {
  // Get game, studios and genres for form.
  async.parallel(
    {
      game(callback) {
        Game.findById(req.params.id)
          .populate("studio")
          .populate("genre")
          .exec(callback);
      },
      studios(callback) {
        Studio.find(callback);
      },
      genres(callback) {
        Genre.find(callback);
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
      // Success.
      // Mark our selected genres as checked.
      for (const genre of results.genres) {
        for (const gameGenre of results.game.genre) {
          if (genre._id.toString() === gameGenre._id.toString()) {
            genre.checked = "true";
          }
        }
      }
      res.render("game_form", {
        title: "Update Game",
        studios: results.studios,
        genres: results.genres,
        game: results.game,
      });
    }
  );
};

// Handle game update on POST.
exports.game_update_post = [
  // Convert the genre to an array
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },

  // Validate and sanitize fields.
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("studio", "Studio must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("genre.*").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Game object with escaped/trimmed data and old id.
    const game = new Game({
      title: req.body.title,
      studio: req.body.studio,
      summary: req.body.summary,
      genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
      _id: req.params.id, //This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all studios and genres for form.
      async.parallel(
        {
          studios(callback) {
            Studio.find(callback);
          },
          genres(callback) {
            Genre.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          // Mark our selected genres as checked.
          for (const genre of results.genres) {
            if (game.genre.includes(genre._id)) {
              genre.checked = "true";
            }
          }
          res.render("game_form", {
            title: "Update Game",
            studios: results.studios,
            genres: results.genres,
            game,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Data from form is valid. Update the record.
    Game.findByIdAndUpdate(req.params.id, game, {}, (err, thegame) => {
      if (err) {
        return next(err);
      }

      // Successful: redirect to book detail page.
      res.redirect(thegame.url);
    });
  },
];

