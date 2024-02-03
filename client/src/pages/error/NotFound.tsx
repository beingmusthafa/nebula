import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      className="flex items-center flex-col mx-auto"
      style={{ marginTop: "35vh" }}
    >
      <h1 className="text-4xl font-bold">Page Not Found</h1>
      <Link to="/" className="mt-4 text-lg font-semibold text-sky-500">
        Click to return to homepage
      </Link>
    </div>
  );
};

export default NotFound;
