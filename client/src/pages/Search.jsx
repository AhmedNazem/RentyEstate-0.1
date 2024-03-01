function Search() {
  return (
    //*the way to sipplinting the screan for two sides at the 1st div
    <div className="flex flex-col md:flex-row ">
      <div className="p-7 border-b-2  md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border border-green-300 bg-green-50 focus:border-green-500  focus:outline-none rounded-lg p-3 w-full"
            />
          </div>
          {/*//* second div after the form  */}
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input type="checkbox" id="all" className="w-5" />
              <span>Rent&Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>
          {/*//*amineties and the other line of the site */}
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
          </div>
          {/*//* div for the search in sort options  */}
          <div className="">
            <label className="font-semibold">Sort: </label>
            <select
              id="sort_order"
              className="border rounded-lg p-3   border-green-300 bg-green-50 focus:border-green-500  focus:outline-none"
            >
              <option value="">Price high to low</option>
              <option value="">Price low to high</option>
              <option value="">Latest</option>
              <option value="">Oldest</option>
            </select>
          </div>
          <button className="bg-green-700 text-white uppercase p-3 rounded-lg hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      {/*//* the separator left and right side  */}
      <div className="">
        <h1 className="text-3xl font-semibold border-b p-3 text-green-800 mt-5">
          Listing Results :D
        </h1>
      </div>
    </div>
  );
}

export default Search;
