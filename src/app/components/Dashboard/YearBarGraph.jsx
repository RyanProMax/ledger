import * as echarts from 'echarts';
import { useEffect, useMemo, useRef } from 'react';

export default function MonthBarGraph({ data }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const option = useMemo(() => ({
    title: {
      text: '本年收支',
      left: 'center',
      textStyle: {
        color: '#606266',
        fontWeight: 'lighter'
      }
    },
    color: ['#b7eb8f', '#ffa39e'],
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['支出', '收入'],
      left: 'left'
    },
    toolbox: {
      show: true,
      feature: {
        magicType: { show: true, type: ['line', 'bar'] },
        saveAsImage: { show: true, title: '保存' }
      }
    },
    // calculable: true,
    xAxis: [
      {
        type: 'category',
        // prettier-ignore
        data: data.map((c) => c.formatDate),
        splitLine: {
          show: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: {
          show: false
        }
      },
      {
        type: 'value',
        position: 'right',
        splitLine: {
          show: false
        }
      }
    ],
    series: [
      {
        name: '支出',
        type: 'bar',
        data: data.map((c) => Math.abs(c.spending / 100)),
        markPoint: {
          data: [
            {
              name: 'Max', type: 'max'
            }
          ]
        },
        markLine: {
          data: [{ type: 'average', name: 'Avg' }]
        }
      },
      {
        name: '收入',
        type: 'bar',
        yAxisIndex: 1,
        data: data.map((c) => c.income / 100)
      }
    ]
  }), [data]);

  const initChart = () => {
    chartInstanceRef.current.setOption(option);
  };

  useEffect(() => {
    chartInstanceRef.current = echarts.init(chartRef.current);
    const resizeCb = () => {
      chartInstanceRef.current.resize();
    };
    const doubleResize = () => {
      resizeCb();
      // fix: 部分图形可能resize失败
      setTimeout(() => resizeCb(), 50);
    };

    window.addEventListener('resize', doubleResize);
    return () => window.removeEventListener('resize', doubleResize);
  }, []);

  useEffect(() => {
    initChart();
  }, [data]);

  return (
    <div className="ledger-dashboard-wrapper">
      <div ref={chartRef} className="ledger-dashboard-chart" />
    </div>
  );
}
