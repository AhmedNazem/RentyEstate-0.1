import mongoose from "mongoose";
//creating listings (uploading)
const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    discription: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    dissacountPrice: {
      type: Number,
      required: true,
    },
    baths: {
      type: Number,
      required: true,
    },
    furnished: {
      type: Boolean,
      required: true,
    },
    parking: {
      type: Boolean,
      required: true,
    },
    type: {
      //rent or sale
      type: String,
      required: true,
    },
    offer: {
      type: Boolean,
      required: true,
    },
    imagesURLs: {
      type: Array,
      required: true,
    },
    userRef: {
      // for the one who create the listing
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
