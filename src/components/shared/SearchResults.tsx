import { Models } from "appwrite";
import Loader from "./Loader";
import GridPostList from "./GridPostList";

type SearchResultsProps = {
  data: {
    total: number;
    documents: Models.Document[];
  };
  isSearchFetching: boolean;
};

const SearchResults = ({ data, isSearchFetching }: SearchResultsProps) => {
  console.log(data);
  if (isSearchFetching) return <Loader miniLoader={true} />;
  return (
    <div className="w-full">
      <p className="text-light-3 text-center  font-semibold mb-8">
        {data.total === 0
          ? "No Results Found"
          : `[ ${data.total} ] Results Found`}
      </p>
      <div>
        {data.documents.length > 0 && <GridPostList posts={data.documents} />}
      </div>
    </div>
  );
};

export default SearchResults;
