import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
function Listingitem({ listing }) {
  return (
    <div className="bg-green-100  shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageURLs[0] ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLuDa_gWz1PvrbI6bTQAKyZ5yiJrs9Qa72tA&usqp=CAU"
          }
          alt="listing cover "
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 ">
          <p className="truncate font-semibold text-lg text-green-900">
            {listing.name}
          </p>

          <div className=" flex items-center  gap-1 ">
            <MdLocationOn className="h-4 w-4 text-cyan-700" />
            <p className="text-sm truncate text-slate-700 w-full">
              {listing.address}
            </p>
          </div>
          {/*//? line climp is used to truncate more than one line */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.discription}
          </p>
          <p className="text-slate-700 font-semibold mt-2">
            $
            {listing.offer
              ? listing.dissacountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && " / Month"}
          </p>
          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms} bed`}
            </div>
            <div className="font-bold text-xs">
              {listing.baths > 1
                ? `${listing.baths} baths`
                : `${listing.baths} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Listingitem;
