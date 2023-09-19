import React, { useState, useEffect } from "react";
import ApexCharts from 'apexcharts';
import $ from 'jquery';
const ChartComp = ({ 
  data = () => {},
  dataLable = () => {},
  type = 'bar',
  title = '',
  text = '',
  name='',
  height ='',
  Typerun = 1,
  id="Chart1",
  colors = () => {},/* List màu */
}) => { /* type="bar|line|area|bubble|pie" */
  // chạy sau khi tạo ra giao diện
  useEffect(async () => {
     
   if(Typerun > 1){
      
    RenderDataChart();
   }
  }, [Typerun])

  const [options,setoptions] = useState([]);

  const RenderDataChart = async () => {
     
    const options = {
      series: [{
        name: name,
        data: data
      },
      
      ],
      chart: {
        height: height,
        type: type,
        zoom: {
          enabled: true
        },
      },
      dataLabels: {
        enabled: false
      },
      /*  thuộc tính của chart */
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
          dataLabels: {
            position: 'top', 
            style: {
              marginBottom:'350px'
            },
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + "%";
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
      xaxis: {
        labels: {
          rotate: -45
        },
        categories:dataLable,
        tickPlacement: 'on'
      },
      yaxis: {
        title: {
          text: title,
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
        y: {
          formatter: function (val) {
            return val + "%";
          }
        }
      }
      };

        $("#chartbk .apexcharts-canvas").remove();
      const chartsint = new ApexCharts(document.querySelector("#chartbk"), options);
      chartsint.render();
  }

return (
  
  <div id='chartbk'>
  </div>
)
};

export const ApexchartsColumn = React.memo(ChartComp);