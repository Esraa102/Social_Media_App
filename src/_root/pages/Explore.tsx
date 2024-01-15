/* eslint-disable react-hooks/exhaustive-deps */
import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import {
  useGetInfinitPosts,
  useSearchPosts,
} from "@/lib/react-query/queriesAndMutations";
const Explore = () => {
  const { ref, inView } = useInView();
  const [searchValue, setSearchValue] = useState("");
  const { data: posts, hasNextPage, fetchNextPage } = useGetInfinitPosts();
  const debouncedValue = useDebounce(searchValue, 3000);
  const { data: searchedPosts, isFetching: isSearchFetching } =
    useSearchPosts(debouncedValue);
  useEffect(() => {
    if (inView && !searchValue) fetchNextPage();
  }, [inView, searchValue]);

  if (!posts) return <Loader miniLoader={true} />;

  const showSearchResults = searchValue !== "";
  const showPopularPost =
    !showSearchResults &&
    posts.pages.every((item) => {
      if (item) {
        item.documents.length > 0;
        return true;
      }
      return false;
    });
  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold">Search Posts</h2>
        <div className="flex gap-1 rounded-lg bg-dark-4 w-full px-4">
          <Input
            className="explore-search"
            type="search"
            placeholder="Search here..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <img
            src="/public/assets/icons/search.svg"
            alt="search"
            width={24}
            height={24}
          />
        </div>
        <div className="flex-between w-full max-w-5xl mt-16 mb-7">
          <h3 className="body-bold md:h3-bold">Popular Today</h3>
          <div className="flex-center gap-3 bg-dark-3 rounded-xl cursor-pointer py-2 px-4">
            <p className="small-medium lg:base-medium text-light-2">All</p>
            <img
              src="/public/assets/icons/filter.svg"
              alt="filter"
              width={20}
              height={20}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-8 w-full max-w-5xl">
          {showSearchResults && searchedPosts ? (
            <SearchResults
              data={searchedPosts}
              isSearchFetching={isSearchFetching}
            />
          ) : showPopularPost ? (
            posts?.pages.map((item, index) => {
              if (item) {
                return (
                  <GridPostList key={`page-${index}`} posts={item.documents} />
                );
              }
            })
          ) : (
            <p className="text-light-3 text-center w-full">End Of Posts</p>
          )}
        </div>
        {hasNextPage && !searchValue && (
          <div ref={ref} className="mt-10">
            <Loader miniLoader />
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
