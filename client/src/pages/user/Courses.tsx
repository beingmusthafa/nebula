import { useEffect, useState } from "react";
import FiltersBar from "../../components/FiltersBar";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import CourseCard from "../../components/CourseCard";
import CourseSkeleton from "../../components/skeletons/CourseSkeleton";

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  discount: number;
  rating: number;
  ratingCount: number;
  language: string;
  tutor: {
    name: string;
    image: string;
    bio: string;
  };
  benefits: string[];
  requirements: string[];
}
interface PageInfo {
  page: number;
  pages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number;
  prevPage: number;
  total: number;
}
const Courses = () => {
  console.log("parent");
  const location = useLocation();
  console.log("location", location.search);
  const searchParams = new URLSearchParams(useLocation().search);
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const search = searchParams.get("search") || "";
  const minPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : 0;
  const maxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : 99999;
  const category = searchParams.get("category") || "";
  const language = searchParams.get("language") || "";
  const sort = searchParams.get("sort") || "";
  let [courses, setCourses] = useState<Course[]>([]);
  let [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  console.log(pageInfo);
  let [currentPage, setCurrentPage] = useState(page);
  const skeletons = new Array(10).fill(0);
  let [loading, setLoading] = useState(true);
  useEffect(() => {
    try {
      async function fetchData() {
        setLoading(true);
        const res = await fetch(
          `/api/search-courses?page=${currentPage}&search=${
            search || ""
          }&minPrice=${minPrice}&maxPrice=${maxPrice}&category=${category}&language=${language}&sort=${sort}`
        ).then((res) => res.json());
        if (!res.success) return toast.error(res.message);
        const { docs: _docs, ...info } = res.result;
        setCourses(_docs);
        setPageInfo(info);
        console.log({ docs: res.result.docs });
        setLoading(false);
      }
      fetchData();
    } catch (error) {
      toast.error("Something went wrong");
    }
  }, [location.search, currentPage]);
  return (
    <>
      <FiltersBar
        page={currentPage}
        search={search}
        filters={{ minPrice, maxPrice, category, language, sort }}
      />{" "}
      {loading ? (
        <div className="w-full flex md:justify-start justify-evenly flex-wrap p-6 gap-6">
          {skeletons.map((skeleton) => (
            <CourseSkeleton />
          ))}
        </div>
      ) : //if courses are filled
      courses.length > 0 ? (
        <>
          <h2 className="_font-dm-display text-2xl px-8">
            {pageInfo?.total} courses found:
          </h2>
          <div className="w-full flex flex-col md:flex-row md:justify-start items-center md:items-start flex-wrap p-6 gap-6">
            {courses.map((course) => (
              <CourseCard course={course} key={course._id} />
            ))}
          </div>
          <div className="w-full flex justify-center items-center my-8">
            <div className="flex gap-4">
              {pageInfo?.hasPrevPage && (
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className=" bg-sky-500 text-white rounded-md"
                >
                  <i className="bx bxs-chevron-left text-xl"></i>
                </button>
              )}
              {
                <p className="text-lg font-bold border-2 px-3 border-slate-500">
                  {pageInfo?.page}
                </p>
              }
              {pageInfo?.hasNextPage && (
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className=" bg-sky-500 text-white rounded-md"
                >
                  <i className="bx bxs-chevron-right text-xl"></i>
                </button>
              )}
            </div>{" "}
          </div>
        </>
      ) : (
        //if courses are NOT filled
        <div className="flex w-full my-80 md:mt-52 items-center justify-center text-xl font-semibold">
          <div className="flex flex-col items-center">
            <i className="bx bx-sad text-5xl text-sky-500"></i>No courses found
          </div>
        </div>
      )}
    </>
  );
};

export default Courses;
