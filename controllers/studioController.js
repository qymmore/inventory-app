const Studio = require("../models/studio");
const async = require("async");
const Game = require("../models/game");


// Display list of all Studios.
exports.studio_list = function (req, res, next) {
  Studio.find()
    .sort([["name", "ascending"]])
    .exec(function (err, list_studios) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("studio_list", {
        title: "Studio List",
        studio_list: list_studios,
      });
    });
};

// Display detail page for a specific Studio.
exports.studio_detail = (req, res, next) => {
  async.parallel(
    {
      studio(callback) {
        Studio.findById(req.params.id).exec(callback);
      },
      studios_games(callback) {
        Game.find({ studio: req.params.id }, "title summary").exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        // Error in API usage.
        return next(err);
      }
      if (results.studio == null) {
        // No results.
        const err = new Error("Studio not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("studio_detail", {
        title: "Studio Detail",
        studio: results.studio,
        studio_games: results.studios_games,
      });
    }
  );
};


// Display Studio create form on GET.
exports.studio_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Studio create GET");
};

// Handle Studio create on POST.
exports.studio_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Studio create POST");
};

// Display Studio delete form on GET.
exports.studio_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Studio delete GET");
};

// Handle Studio delete on POST.
exports.studio_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Studio delete POST");
};

// Display Studio update form on GET.
exports.studio_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Studio update GET");
};

// Handle Studio update on POST.
exports.studio_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Studio update POST");
};
