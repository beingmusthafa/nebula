import { LineChart } from "@mui/x-charts";

interface Props {
  data1: number[];
  data2: number[];
  xLabels: string[] | number[];
}
const LineChartComponent: React.FC<Props> = ({ data1, data2, xLabels }) => {
  return (
    <LineChart
      series={[
        { data: data1, label: "Enrollments" },
        { data: data2, label: "Revenue" },
      ]}
      xAxis={[{ scaleType: "point", data: xLabels }]}
    />
  );
};
export default LineChartComponent;
