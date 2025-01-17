import { useState } from "react";

function SearchArea() {
  const [searchKeyword, setSearchKeyword] = useState("");

  const searchIt = async e => {
    e.preventDefault();
    console.log("검색");
  };

  return (
    <>
      <form onSubmit={searchIt}>
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          검색
        </label>
        <div className="relative w-[400px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-rose-300 focus:border-rose-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-rose-300 dark:focus:border-rose-300"
            placeholder="찾고 싶은 상품을 검색하세요"
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.currentTarget.value)}
            onBlur={e => setSearchKeyword(e.currentTarget.value)}
          />
          <button
            className="text-white absolute right-1.5 bottom-2 bg-sky-500 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-2 py-1 dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800"
            onClick={searchIt}
          >
            검색
          </button>
        </div>
      </form>
    </>
  );
}

export default SearchArea;
