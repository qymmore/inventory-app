const GameInstance = require("../models/gameinstance");

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
exports.gameinstance_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: GameInstance create GET");
};

// Handle GameInstance create on POST.
exports.gameinstance_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: GameInstance create POST");
};

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
