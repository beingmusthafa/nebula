import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { Link } from "react-router-dom";
import { ITutorReport } from "../../interfaces/reports.interface";

const Reports_tutor = () => {
  const [reports, setReports] = useState<ITutorReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("monthly");
  const getReports = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + `/api/tutor/get-${type}-reports`,
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
    <Loading />
  ) : (
    <div className="w-full">
      <select
        className="border h-fit p-1 rounded-full border-black m-4"
        name=""
        id=""
        onChange={(e) => setType(e.target.value)}
      >
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
              to={"/tutor/reports/view-report/" + report._id}
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

export default Reports_tutor;
