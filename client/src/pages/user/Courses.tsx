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
  let [currentPage, setCurrentPage] = useState(page);
  const skeletons = new Array(10).fill(0);
  let [loading, setLoading] = useState(true);
  useEffect(() => {
    try {
      setLoading(true);
      async function fetchData() {
        const res = await fetch(
          `/api/search-courses?page=${currentPage}&search=${
            search || ""
          }&minPrice=${minPrice}&maxPrice=${maxPrice}&category=${category}&language=${language}&sort=${sort}`
        ).then((res) => res.json());
        if (!res.success) return toast.error(res.message);
        setCourses(res.result.docs);
        console.log({ docs: res.result.docs });
      }
      fetchData();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, [location.search]);
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
      ) : courses.length > 0 ? (
        <div className="w-full flex md:justify-start justify-evenly flex-wrap p-6 gap-6">
          {courses.map((course) => (
            <CourseCard course={course} key={course._id} />
          ))}
        </div>
      ) : (
        <div className="flex w-full mt-52 items-center justify-center text-xl font-semibold">
          <div className="flex flex-col items-center">
            <i className="bx bx-sad text-5xl text-sky-500"></i>No courses found
          </div>
        </div>
      )}
    </>
  );
};

export default Courses;
