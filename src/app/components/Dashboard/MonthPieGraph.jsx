import { Radio } from 'antd';
import * as echarts from 'echarts';
import {
  useEffect, useMemo, useRef, useState
} from 'react';

export default function MonthPieGraph({ data }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [type, setType] = useState(1);
  // 格式化
  const formatData = useMemo(() => {
    const list = data.filter((c) => c.type === type);
    const obj = {};
    list.forEach((r) => {
      if (!obj[r.className]) obj[r.className] = 0;
      obj[r.className] += Math.abs(r.value);
    });
    return Object.entries(obj).map(([k, v]) => ({ name: k, value: v / 100 })).sort((a, b) => b.value - a.value);
  }, [data, type]);

  const option = useMemo(() => ({
    title: {
      text: `本月${type === 0 ? '收入' : '支出'}`,
      left: 'center',
      textStyle: {
        color: '#606266',
        fontWeight: 'lighter'
      }
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'right'
    },
    series: [
      {
        type: 'pie',
        roseType: 'radius',
        itemStyle: {
          borderRadius: 5
        },
        avoidLabelOverlap: true,
        minShowLabelAngle: 50,
        data: formatData
      }
    ]
  }), [data, type]);

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
  }, [data, type]);

  return (
    <div className="ledger-dashboard-wrapper">
      <div ref={chartRef} className="ledger-dashboard-chart" />
      <div className="ledger-dashboard-operator">
        <Radio.Group onChange={(e) => setType(e.target.value)} value={type} size="small">
          <Radio value={1}>支出</Radio>
          <Radio value={0}>收入</Radio>
        </Radio.Group>
      </div>
    </div>
  );
}
