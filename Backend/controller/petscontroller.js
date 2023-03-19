const Pet = require("../models/petsmodel.js");
const ErrorHandler = require("../utils/errorhandler");
const cloudinary = require("cloudinary");
const catchasyncerrors = require("../middleware/catchasyncerrors");


// Create Pets -- Admin
exports.createpet = catchasyncerrors(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }
  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "pet",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks; 
  req.body.user = req.user.id;
  const pet = await Pet.create(req.body);
  res.status(201).json({
    success: true,
    pet,
  });
});

//Get all pets
exports.getallpets = catchasyncerrors(async (req, res, next) => {
  console.log(req.body);
  var filter = {}
  //if (req.body.rating.length != 0)
    // filter.ratings = {
    //   $in: req.body.rating
    // };
  if (req.body.price.length != 0)
    filter.price = {
      $gte: req.body.price[0],
      $lte: req.body.price[1]
    }
  if (req.body.breed.length != 0)
    filter.breed = {
      $in: req.body.breed
    }
  
  if (req.body.petClass.length != 0)
    filter.petClass = {
      $in: req.body.petClass
    }
  console.log(filter);
  const pets = await Pet.find(filter);
  res.status(200).json({
    success: true,
    pets,
  });
});

exports.getBreeds = catchasyncerrors(async (req, res, next) => {
  const breeds = await Pet.distinct("breed");
  res.status(200).json({
    success: true,
    breeds: breeds
  });
});

exports.getPetClass = catchasyncerrors(async (req, res, next) => {
  const petClass = await Pet.distinct("petClass");
  res.status(200).json({
    success: true,
    petClass: petClass
  });
});

//get single pet details
exports.getpetdetails = catchasyncerrors(async (req, res, next) => {
  let pet = await Pet.findById(req.params.id);
   if (!pet) {
     return next(new ErrorHandler("pet not found", 404));
   }

  res.status(200).json({
    success: true,
    pet,
  });
});

//update pet details--admin
exports.updatepetdetails = catchasyncerrors(async (req, res, next) => {
  let pet = await Pet.findById(req.params.id);
  if (!pet) {
    return next(new ErrorHandler("pet not found", 404));
  }
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < petfood.images.length; i++) {
      await cloudinary.v2.uploader.destroy(petfood.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "pet",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }
  pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    pet,
  });
});



//delete pet--admin
exports.deletepet = catchasyncerrors(async (req, res, next) => {
  let pet = await Pet.findById(req.params.id);
  if (!pet) {
    return next(new ErrorHandler("pet not found", 404));
  }
 await pet.remove();
  res.status(200).json({
    success: true,
    message: "pet deleted successfully",
  });
});


// Create New Review or Update the review
exports.createpetreview = catchasyncerrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const pet = await Pet.findById(productId);

  const isReviewed = pet.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    pet.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    pet.reviews.push(review);
    pet.numofreviews = pet.reviews.length;
  }

  let avg = 0;

  pet.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  pet.ratings = avg / pet.reviews.length;

  await pet.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
exports.getpetreviews = catchasyncerrors(async (req, res, next) => {
  const pet = await Pet.findById(req.query.id);

  if (!pet) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: pet.reviews,
  });
});

// Delete Review
exports.deletepetreview = catchasyncerrors(async (req, res, next) => {
  const pet = await Pet.findById(req.query.productId);

  if (!pet) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = pet.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numofreviews = reviews.length;

  await Pet.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numofreviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});