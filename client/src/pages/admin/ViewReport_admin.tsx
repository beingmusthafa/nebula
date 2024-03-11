import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLoading from "../../components/admin/AdminLoading";
import { toast } from "react-toastify";
import { IAdminReport } from "../../interfaces/reports.interface";

const ViewReport_admin = () => {
  const { reportId } = useParams();
  let [report, setReport] = useState<IAdminReport | null>(null);
  let [loading, setLoading] = useState(true);
  const getReport = async () => {
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/admin/get-report/" + reportId,
        {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());
      setLoading(false);
      if (!res.success) throw new Error(res.message);
      setReport(res.report);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getReport();
  }, []);

  const handleDownload = async () => {
    const toastId = toast.loading("Starting report download");
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL +
          "/api/admin/download-report-pdf/" +
          reportId,
        {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());
      if (!res.success) throw new Error(res.message);
      const pdfBinary = Uint8Array.from(atob(res.pdfBuffer), (c) =>
        c.charCodeAt(0)
      );
      const url = URL.createObjectURL(
        new Blob([pdfBinary], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "admin-report.pdf";
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
    <AdminLoading />
  ) : (
    <div className="w-full flex flex-col items-center">
      <h2 className="_font-tilt-warp text-3xl mb-2">
        Admin {report?.type} report
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
          <th className="border border-black p-4 text-center">New users</th>
          <td className="border border-black p-4 text-center">
            {report?.usersCount}
          </td>
        </tr>
        <tr>
          <th className="border border-black p-4 text-center">
            No. of enrollments
          </th>
          <td className="border border-black p-4 text-center">
            {report?.enrollmentsCount}
          </td>
        </tr>
        <tr>
          <th className="border border-black p-4 text-center">Revenue</th>
          <td className="border border-black p-4 text-center">
            {report?.revenue}
          </td>
        </tr>
        <tr>
          <th className="border border-black p-4 text-center">Earnings</th>
          <td className="border border-black p-4 text-center">
            {report?.earnings}
          </td>
        </tr>
      </table>

      <h3 className="font-semibold text-xl mb-4 mt-20">
        Enrollments by category
      </h3>
      <table className="w-72">
        <tr>
          <th className="border border-black p-4 text-center">Category</th>
          <th className="border border-black p-4 text-center">
            No. of enrollments
          </th>
        </tr>
        {report?.enrollmentsByCategory.map((category) => {
          return (
            <tr>
              <td className="border border-black p-4 text-center">
                {category.name}
              </td>
              <td className="border border-black p-4 text-center">
                {category.count}
              </td>
            </tr>
          );
        })}
      </table>

      <h3 className="font-semibold text-xl mb-4 mt-20">
        Enrollments by course
      </h3>
      <table className="w-72">
        <tr>
          <th className="border border-black p-4 text-center">Course</th>
          <th className="border border-black p-4 text-center">
            No. of enrollments
          </th>
        </tr>
        {report?.enrollmentsByCourse.map((course) => {
          return (
            <tr>
              <td className="border border-black p-4 text-center">
                {course.name}
              </td>
              <td className="border border-black p-4 text-center">
                {course.count}
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default ViewReport_admin;
