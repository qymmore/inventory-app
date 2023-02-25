const Studio = require("../models/studio");
const async = require("async");
const Game = require("../models/game");
const { body, validationResult } = require("express-validator");

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
exports.studio_create_get = (req, res, next) => {
  res.render("studio_form", { title: "Create Studio" });
};

// Handle Studio create on POST.
exports.studio_create_post = [
  // Validate and sanitize fields.
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("location")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    //Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("studio_form", {
        title: "Create Studio",
        studio: req.body,
        location: req.body,
        errors: errors.array(),
      });
      return;
    }
    // Data from form is valid.

    // Create an Studio object with escaped and trimmed data.
    const studio = new Studio({
      name: req.body.name,
      location: req.body.location,
    });
    studio.save((err) => {
      if (err) {
        return next(err);
      }
      // Successful - redirect to new studio record.
      res.redirect(studio.url);
    });
  },
];

// Display Studio delete form on GET.
exports.studio_delete_get = (req, res, next) => {
  async.parallel(
    {
      studio(callback) {
        Studio.findById(req.params.id).exec(callback);
      },
      studios_games(callback) {
        Game.find({ studio: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.studio == null) {
        // No results.
        res.redirect("/catalog/studios");
      }
      // Successful, so render.
      res.render("studio_delete", {
        title: "Delete Studio",
        studio: results.studio,
        studio_games: results.studios_games,
      });
    }
  );
};

// Handle Studio delete on POST.
exports.studio_delete_post = (req, res, next) => {
  async.parallel(
    {
      studio(callback) {
        Studio.findById(req.body.studioid).exec(callback);
      },
      studios_games(callback) {
        Game.find({ studio: req.body.studioid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Success
      if (results.studios_games.length > 0) {
        // Studio has games. Render in same way as for GET route.
        res.render("studio_delete", {
          title: "Delete Studio",
          studio: results.studio,
          studio_games: results.studios_games,
        });
        return;
      }
      if(req.body.password == process.env.SECRET_PASS){
        // Studio has no games. Delete object and redirect to the list of studios.
      Studio.findByIdAndRemove(req.body.studioid, (err) => {
        if (err) {
          return next(err);
        }
        // Success - go to studio list
        res.redirect("/catalog/studios");
      });
      } else {
        res.send('Access denied');
      }
    }
  );
};


// Display Studio update form on GET.
exports.studio_update_get = function (req, res, next) {
  Studio.findById(req.params.id, function (err, studio) {
    if (err) {
      return next(err);
    }
    if (studio == null) {
      // No results.
      var err = new Error("Studio not found");
      err.status = 404;
      return next(err);
    }
    // Success.
    res.render("studio_form", { title: "Update Studio", studio: studio });
  });
};

// Handle Studio update on POST.
exports.studio_update_post = [
  // Validate and santize fields.
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("location")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Studio object with escaped and trimmed data (and the old id!)
    var studio = new Studio({
      name: req.body.name,
      location: req.body.location,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.render("studio_form", {
        title: "Update Studio",
        studio: studio,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      if(req.body.password == process.env.SECRET_PASS){
        Studio.findByIdAndUpdate(
          req.params.id,
          studio,
          {},
          function (err, thestudio) {
            if (err) {
              return next(err);
            }
            // Successful - redirect to studio detail page.
            res.redirect(thestudio.url);
          }
        );
      } else {
        res.send('Access denied');
      }
    }
  },
];
