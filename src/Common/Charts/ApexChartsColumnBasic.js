import ReactApexChart from "react-apexcharts";

export const ApexChartsColumnBasic = ({
  data = [],
  name = "",
  data1 = [],
  name1 = "",
  data2 = [],
  name2 = "",
  nameList = [],
}) => {
  const options = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: nameList,
    },

    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return +val + " khách hàng";
        },
      },
    },
  };
  const series = [
    {
      name: name,
      data: data,
    },
    {
      name: name1,
      data: data1,
    },
    {
      name: name2,
      data: data2,
    },
  ];
  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
};

// export default ApexChartsColumnBasic;
