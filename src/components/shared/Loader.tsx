const Loader = ({ miniLoader }: { miniLoader: React.ReactNode }) => {
  return (
    <div
      className={`${
        miniLoader ? "w-full h-full" : "h-screen w-screen"
      } flex-center`}
    >
      <svg
        className={`${
          miniLoader
            ? "h-5 w-5 border-off-white"
            : "h-10 w-10 border-primary-600"
        } animate-spin  bg-transparent 
        border-4 border-t-transparent  rounded-full`}
        viewBox="0 0 24 24"
      ></svg>
    </div>
  );
};

export default Loader;
