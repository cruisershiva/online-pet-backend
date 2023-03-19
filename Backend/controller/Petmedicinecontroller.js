const Petmedicine = require("../models/Petmedicinemodel.js");
const ErrorHandler = require("../utils/errorhandler");
const cloudinary = require("cloudinary");
const catchasyncerrors = require("../middleware/catchasyncerrors");

// Create petmedicine -- Admin
exports.createpetmedicine = catchasyncerrors(async (req, res, next) => {
  let images = [];

if (typeof req.body.images === "string") {
  images.push(req.body.images);
} else {
  images = req.body.images;
}

const imagesLinks = [];

for (let i = 0; i < images.length; i++) {
  const result = await cloudinary.v2.uploader.upload(images[i], {
    folder: "petmedicine",
  });

  imagesLinks.push({
    public_id: result.public_id,
    url: result.secure_url,
  });
}

req.body.images = imagesLinks;  
  req.body.user = req.user.id;
  const petmedicine = await Petmedicine.create(req.body);
  res.status(201).json({
    success: true,
 petmedicine,
  });
});

//Get all petfood
exports.getallpetmedicine = catchasyncerrors(async (req, res, next) => {
  const petmedicine = await Petmedicine.find();
  res.status(200).json({
    success: true,
 petmedicine,
  });
});

//get single petfood details
exports.getpetmedicinedetails = catchasyncerrors(async (req, res, next) => {
  let petmedicine = await Petmedicine.findById(req.params.id);
   if (!petmedicine) {
     return next(new ErrorHandler("petmedicine not found", 404));
   }

  res.status(200).json({
    success: true,
    petmedicine,
  });
});

//update petfood details--admin
exports.updatepetmedicinedetails = catchasyncerrors(async (req, res, next) => {
  let petmedicine = await Petmedicine.findById(req.params.id);
  if (!petmedicine) {
    return next(new ErrorHandler("petmedicine not found", 404));
  }
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < petmedicine.images.length; i++) {
      await cloudinary.v2.uploader.destroy(petmedicine.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "petmedicine",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }
 petmedicine = await Petmedicine.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
 petmedicine,
  });
});



//delete petfood--admin
exports.deletepetmedicine = catchasyncerrors(async (req, res, next) => {
  let petmedicine = await Petmedicine.findById(req.params.id);
  if (!petmedicine) {
    return next(new ErrorHandler("petmedicine not found", 404));
  }
 await petmedicine.remove();
  res.status(200).json({
    success: true,
    message: "petmedicine deleted successfully",
  });
});


// Create New Review or Update the review
exports.createpetmedicinereview = catchasyncerrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const petmedicine = await Petmedicine.findById(productId);

  const isReviewed = petmedicine.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    petmedicine.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    petmedicine.reviews.push(review);
    petmedicine.numofreviews = petmedicine.reviews.length;
  }

  let avg = 0;

  petmedicine.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  petmedicine.ratings = avg / petmedicine.reviews.length;

  await petmedicine.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
exports.getpetmedicinereviews = catchasyncerrors(async (req, res, next) => {
  const petmedicine = await Petmedicine.findById(req.query.id);

  if (!petmedicine) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: petmedicine.reviews,
  });
});

// Delete Review
exports.deletepetmedicinereview = catchasyncerrors(async (req, res, next) => {
  const petmedicine = await Petmedicine.findById(req.query.productId);

  if (!petmedicine) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = petmedicine.reviews.filter(
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

  await Petmedicine.findByIdAndUpdate(
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