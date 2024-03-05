import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";

interface Report {
  type: "weekly" | "monthly" | "yearly";
  tutor: string;
  enrollmentsCount: number;
  enrollmentsByCourse: {
    name: string;
    count: number;
  }[];
  averageRating: number;
  revenue: number;
  earnings: number;
  startDate: Date;
  endDate: Date;
}
const ViewReport_admin = () => {
  const { reportId } = useParams();
  let [report, setReport] = useState<Report | null>(null);
  let [loading, setLoading] = useState(true);
  const getReport = async () => {
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/tutor/get-report/" + reportId
      ).then((res) => res.json());
      setLoading(false);
      if (!res.success) throw new Error(res.message);
      console.log(res.report);
      setReport(res.report);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getReport();
  }, []);
  console.log({ report });

  const handleDownload = async () => {
    const toastId = toast.loading("Starting report download");
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL +
          "/api/tutor/download-report-pdf/" +
          reportId
      ).then((res) => res.json());
      if (!res.success) throw new Error(res.message);
      console.log("buffer", res.pdfBuffer);
      const pdfBinary = Uint8Array.from(atob(res.pdfBuffer), (c) =>
        c.charCodeAt(0)
      );
      const url = URL.createObjectURL(
        new Blob([pdfBinary], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "tutor-report.pdf";
      document.body.appendChild(link);
      link.click();
      toast.dismiss(toastId);
      document.body.removeChild(link);
    } catch (error) {
      toast.dismiss(toastId);
      console.log(error);
    }
  };
  return loading ? (
    <Loading />
  ) : (
    <div className="w-full flex flex-col items-center">
      <h2 className="_font-tilt-warp text-3xl mb-2 mt-10">
        Tutor {report?.type} report
      </h2>
      <p className="font-semibold text-base text-slate-600">
        {new Date(report?.startDate!).toDateString()} -
        {new Date(report?.endDate!).toDateString()}
      </p>
      <button
        onClick={handleDownload}
        className="_fill-btn-blue flex items-center gap-2 mt-4"
      >
        Download
        <i className="bx bx-download text-xl"></i>
      </button>
      <h3 className="font-semibold text-xl mb-4 mt-16">Stats</h3>
      <table className="w-72">
        <tr>
          <th>No. of enrollments</th>
          <td>{report?.enrollmentsCount}</td>
        </tr>
        <tr>
          <th>Average rating</th>
          <td>{report?.averageRating}</td>
        </tr>
        <tr>
          <th>Revenue</th>
          <td>{report?.revenue}</td>
        </tr>
        <tr>
          <th>Earnings</th>
          <td>{report?.earnings}</td>
        </tr>
      </table>

      <h3 className="font-semibold text-xl mt-20 mb-4 ">
        Enrollments by course
      </h3>
      <table className="w-72 mb-20">
        <tr>
          <th>Course</th>
          <th>No. of enrollments</th>
        </tr>
        {report?.enrollmentsByCourse.map((course) => {
          return (
            <tr>
              <td>{course.name}</td>
              <td>{course.count}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default ViewReport_admin;
