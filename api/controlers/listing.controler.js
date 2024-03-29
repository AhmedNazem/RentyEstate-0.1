import Listing from "../models/listing.modle.js";
import { errorHandler } from "../utils/error.js";

//
export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body); //? creating list  and taking the data from the body  in jsx file
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};
export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id); //? finding the list depending on te id
  if (!listing) {
    return next(errorHandler(404, "listing not found "));
  }
  if (req.user.id !== listing.userRef)
    //? delete only your own list
    return next(errorHandler(401, "you can only delete your own list"));
  try {
    await Listing.findByIdAndDelete(req.params.id); //? then delete the list
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
      //? updating the list
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
//? functionality of the search listing :D
export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9; //? max cards per listings
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer; //? the nesseasery values

    if (offer === undefined || offer === "false") {
      //? serround the value of the offer for only the booleans T&F  same proccess for the rest
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
      //? same proccess but here take the string of sale and rent
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || ""; //? create a deafult values of varibles

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" }, // ? here  i means the search fauntonality it not senstive for the lower and upper case
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order }) //? make sorting depending on the ordering asc or desc
      .limit(limit)
      .skip(startIndex);
    //?limit() and .skip() methods are used to control the number of documents returned by a query. They
    //? are commonly used for pagination, where you retrieve a subset of results at a time,
    //? displaying only a certain number of records per page
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
