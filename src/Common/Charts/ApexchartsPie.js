import ReactApexChart from "react-apexcharts";

export const ApexchartsPie = ({
  label = [],
  data = [],
  color = ["#38bdf8", "#fb923c", "#9ca3af", "#facc15", "#3b82f6", "#22c55e"],
}) => {
  const options = {
    chart: {
      width: 380,
      type: "pie",
    },
    labels: label,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    colors: color,
  };

  const series = data;
  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="pie"
        height={350}
      />
    </div>
  );
};

// export default ApexChartsColumnBasic;
