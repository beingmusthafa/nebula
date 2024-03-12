import React, { useEffect, useState } from "react";
import AdminLoading from "../../components/admin/AdminLoading";
import { Link } from "react-router-dom";

interface Report {
  _id: string;
  startDate: Date;
  endDate: Date;
}
const Reports_admin = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("monthly");
  const getReports = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + `/api/admin/get-${type}-reports`,
        {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());
      if (!res.success) throw new Error(res.message);
      setReports(res.reports);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getReports();
  }, [type]);
  return loading ? (
    <AdminLoading />
  ) : (
    <div className="w-full">
      <select name="" id="" onChange={(e) => setType(e.target.value)}>
        <option selected={type === "weekly"} value="weekly">
          Weekly
        </option>
        <option selected={type === "monthly"} value="monthly">
          Monthly
        </option>
        <option selected={type === "yearly"} value="yearly">
          Yearly
        </option>
      </select>
      {reports.length > 0 ? (
        reports.map((report, index) => (
          <div
            key={report._id}
            className="flex justify-center py-3 px-6 border-b-2 border-b-slate-400 text-base font-semibold "
          >
            <Link
              className="hover:text-sky-600 _transition-0-3"
              to={"/admin/stats/reports/view-report/" + report._id}
            >
              {new Date(report.startDate).toDateString()} -
              {new Date(report.endDate).toDateString()}
            </Link>
          </div>
        ))
      ) : (
        <p className="text-center text-2xl _font-dm-display text-slate-400 mt-44">
          No {type} reports found
        </p>
      )}
    </div>
  );
};

export default Reports_admin;
