import Listing from "../models/listing.modle.js";
import { errorHandler } from "../utils/error.js";

//
export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};
export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "listing not found "));
  }
  if (req.user.id !== listing.userRef)
    return next(errorHandler(401, "you can only delete your own list"));
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("lsiting has been deleted ");
  } catch (err) {
    next(err);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "listing not found"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "you can only edit your on listing "));
  }
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (err) {
    next(err);
  }
};
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "listing not found "));
    }
    res.status(200).json(listing);
  } catch (err) {
    next(err);
  }
};
export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
// export const getListings = async (req, res, next) => {
//   try {
//     const limit = parseInt(req.query.limit) || 9; //? the query is for ex in the link bar  when we want to seach for somthing it shows some key word like /search? or  limit?
//     const startIndex = parseInt(req.query.startIndex) || 0; //? same thing here
//     let offer = req.query.offer;
//     if (offer === undefined || offer === "false") {
//       offer = { $in: [false, true] };
//       //?If the URL is api/listings (without the "offer" parameter),
//       //?it will retrieve listings where the "offer" field is either false or true.
//       //! or just the way to ignaore the undefind value
//     }
//     let furnished = req.query.furnished;
//     if (furnished === undefined || furnished === "false") {
//       furnished = { $in: [false, true] }; //!way to limit the value of the variable
//     }
//     let parking = req.query.parking;
//     if (parking === undefined || parking === "false ") {
//       parking = { $in: [true, false] };
//     }
//     let type = req.query.type;
//     if (type === undefined || type === "all") {
//       type = { $in: ["sale", "rent"] };
//     }
//     const searchTerm = req.query.searchTerm || "";
//     const sort = req.query.sort || "createdAt";
//     const order = req.query.order || "desc";
//     const lsitings = await Listing.find({
//       //? i means the search algorthim will not give a fuck about the
//       //?upper &&lower case word just take all them
//       name: { $regex: searchTerm, $options: "i" },
//       offer,
//       furnished,
//       parking,
//       type, //! all these things are involved in the search query bar
//     })
//       .sort({ [sort]: order })
//       .limit(limit)
//       .skip(startIndex); //? use the sort method then used the sort value then init for the order
//     return res.status(200).json(lsitings);
//   } catch (err) {
//     next(err);
//   }
// };
