import React, { useState, useEffect } from "react";
import ApexCharts from 'apexcharts';
import $ from 'jquery';
const ApexchartsComp = ({
  data = () => { }, /* List data cho column  */
  data1 = [], /* List data cho column 1 */
  data2 = [], /* List data cho column 2 */
  data3 = [], /* List data cho column 3 */
  name = '',/* Ghi chú khi hover vào cột dữ liệu  */
  name1 = '',/* Ghi chú khi hover vào cột dữ liệu 1 */
  name2 = '',/* Ghi chú khi hover vào cột dữ liệu 2 */
  name3 = '',/* Ghi chú khi hover vào cột dữ liệu 3 */
  dataLable = () => { },/* List tên : ví dụ tên nhân viên hay tên chi nhánh ..... */
  type = 'bar', /* type="bar|line|area|bubble" */
  height = 350,  /* chiều cao của chart */
  Typerun = 1,
  title = '', /* tên tiêu đề chart */
  textx = '',/* tiêu đề cột muốn đánh dấu : ví dụ tên nhân viên hay tên chi nhánh ..... */
  x = '', /* ví dụ tên nhân viên hay tên chi nhánh muốn được đánh dấu */
  colors = () => { },/* List màu */
  id = "Chart1",/* id chart */
  idchart = "#" + id, /* id chart */
  fixval = '%', /* format giá trị hover show lên */
  positionfix = 'top',
  enabledfix = true,
  Keycheck = 0,
}) => { /* type="bar|line|area|bubble|pie" */
  // chạy sau khi tạo ra giao diện
  useEffect(async () => {
    if (Typerun > 1) {
      RenderDataChart();
    }
  }, [Typerun])

  const [options, setoptions] = useState([]);

  const RenderDataChart = async () => {
     
    const options = {
      series: [
        {
          name: name === 'B' ? 'Tỷ lệ' : name,
          data: data
        },
        {
          name: name1,
          data: data1
        },
        {
          name: name2,
          data: data2
        },
        {
          name: name3,
          data: data3
        }
      ],
      /*  đánh dấu một cột dữ liệu */
      annotations: {
        points: [{
          x: x,
          seriesIndex: 0,
          label: {
            borderColor: '#775DD0',
            offsetY: 0,
            style: {
              color: '#fff',
              background: '#775DD0',
            },
            text: textx,
          }
        }]
      },
      /*  sét loại và chiều cao của chart */
      chart: {
        height: height,
        type: type,
      },
      /*  thuộc tính của chart */
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
          dataLabels: {
            position: positionfix,
            style: {
              marginBottom: '350px'
            },
          },
        },
      },
      dataLabels: {
        enabled: Keycheck === 0 ? true : false,
        formatter: function (val) {
          return val + fixval;
        },
        offsetY: -20,
        style: {
          fontSize: '7px',
          colors: ["#304758"],

        }
      },
      stroke: {
        width: 2
      },

      grid: {
        row: {
          colors: colors
        }
      },
      /* format x*/
      xaxis: {
        labels: {
          rotate: -45
        },
        categories: dataLable,
        tickPlacement: 'on'
      },
      /*  format y */
      yaxis: {
        text: title,
        labels: {
          formatter: function (value) {
            if (Keycheck !== 0) {
              /*   return value; */
              var p = value === undefined ? 0 : value.toFixed(0);
              var num = 0;
              if (p < 1000) return (p + "").replace(".", ",");
              return p.split("").reverse().reduce(function (acc, p, i, orig) {
                return p + (i && !(i % 3) ? "," : "") + acc;
              },
                "");
            }
            else {
              return value
            }
          }
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100]
        },
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val, opts) {
                return val + fixval

              }
            }
          },
          {
           
            title: {
              formatter: function (val, opts) {
                if (name1 !== '') {
                  return val + fixval
                }
                else {
                  return ''
                }
              }
            }
          },
          {
            title: {
              formatter: function (val, opts) {
                if (name1 !== '') {
                  return val + fixval
                }
                else {
                  return ''
                }
              }
            }
          },
          {
            title: {
              enabled:true,
              formatter: function (val, opts) {
                if (name1 !== '') {
                  return val + fixval
                }
                else {
                  return ''
                }

              }
            }
          },
        ]
      },
    };

    $(idchart + " .apexcharts-canvas").remove();
    const chartsint = new ApexCharts(document.querySelector(idchart), options);
    chartsint.render();
  }

  return (

    <div id={id}>
    </div>
  )
};

export const ApexchartsColumn_V2 = React.memo(ApexchartsComp);