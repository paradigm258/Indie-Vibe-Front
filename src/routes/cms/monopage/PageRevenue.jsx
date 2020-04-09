import React, { useContext, useEffect, useState } from 'react';
import { getRevenueMonth, getRevenueYear } from '../../../apis/APICms';
import { LineMulBlack } from '../../../components/charts';
import { AuthContext } from '../../../contexts';
import {
  createYearOptions,
  currency,
  current,
  months
} from '../../../utils/Common';

function Revenue(props) {
  return (
    <div className='mono-page-wrapper'>
      <div className='mono-page page-revenue padder fadein'>
        <section className='annual boxy catalog-menu'>
          <RevenueSection
            header='Annual Revenue'
            type='year'
            title={{
              total: 'Total revenue each year',
              comparison: 'Fixed and Monthly Comparison'
            }}
          />
        </section>
        <section className='monthly boxy catalog-menu'>
          <RevenueSection
            header='Revenue by Months'
            type='monthly'
            title={{
              total: 'Total revenue through the year',
              comparison: 'Monthly comparison'
            }}
            rtl={false}
          />
          <div></div>
        </section>
      </div>
    </div>
  );
}

function RevenueSection({
  header = '',
  type = 'year',
  title = {
    total: '',
    comparison: ''
  },
  rtl = true
}) {
  const { state: authState } = useContext(AuthContext);

  const [form, setForm] = useState({
    start: 2019,
    end: current.year,
    year: current.year,
    submitting: false
  });
  const [selectedSum, setSelectedSum] = useState(
    type === 'year' ? 0 : current.month - 1
  );
  const [selectedComparison, setSelectedComparison] = useState(
    type === 'year' ? 0 : current.month - 1
  );
  const [chartTotal, setChartTotal] = useState([
    {
      label: 'Total revenue',
      data: [],
      borderColor: '#23aecd',
      backgroundColor: 'rgba(35, 174, 205, 0.1)'
    }
  ]);
  const [chartComparison, setChartComparison] = useState([
    {
      label: 'Fixed purchase',
      data: [],
      borderColor: '#9100ea',
      backgroundColor: 'rgba(145, 0, 234, 0.1)'
    },
    {
      label: 'Monthly subscription',
      data: [],
      borderColor: '#46a049',
      backgroundColor: 'rgba(70, 160, 73, 0.1)'
    }
  ]);

  useEffect(() => {
    setForm({ ...form, submitting: true });
    getRevenue(
      authState.token,
      type,
      form.start,
      form.end,
      form.month,
      form.year
    )
      .then(res => {
        if (res.status === 'success' && res.data) {
          setForm({ ...form, submitting: false });
          const { data } = res;

          const newChartComparison = [...chartComparison];
          newChartComparison[0].data = data.fixed;
          newChartComparison[1].data = data.monthly;

          const newChartTotal = [...chartTotal];
          newChartTotal[0].data = data.fixed.map(
            (num, i) => num + data.monthly[i]
          );

          setChartComparison([...newChartComparison]);
          setChartTotal([...newChartTotal]);
        } else throw res.data;
      })
      .catch(err => {
        console.error(err);
      });
  }, [form.start, form.end, form.month, form.year]);

  let labels = [];
  if (type === 'year') {
    for (let i = form.start; i <= form.end; i++) {
      labels.push(i);
    }
  } else {
    labels = [...months.short];
  }

  const handleChangeMonth = e => {
    setForm({ ...form, month: e.target.value });
  };

  const handleChangeYear = e => {
    const target = e.target;
    setForm({ ...form, [target.getAttribute('name')]: target.value });
  };

  return (
    <React.Fragment>
      <div className='header'>
        <span className='font-short-semi font-weight-bold'>{header}</span>
      </div>
      <div className='content'>
        {type === 'year' ? (
          <div className='d-flex align-items-center pb-3'>
            <div>
              <label htmlFor='annual-start' className='pr-2'>
                Select start year
              </label>
            </div>
            <select
              id='annual-start'
              name='start'
              value={form.start}
              className='custom-select'
              onChange={handleChangeYear}
            >
              {createYearOptions()}
            </select>
            <div className='ml-3'>
              <label htmlFor='annual-end' className='pr-2'>
                Select end year
              </label>
            </div>
            <select
              id='annual-end'
              name='end'
              value={form.end}
              className='custom-select'
              onChange={handleChangeYear}
            >
              {createYearOptions()}
            </select>
          </div>
        ) : (
          <div className='d-flex align-items-center pb-3'>
            <div className='ml-3'>
              <label htmlFor='year' className='pr-2'>
                Select end year
              </label>
            </div>
            <select
              id='year'
              name='year'
              value={form.year}
              className='custom-select'
              onChange={handleChangeYear}
            >
              {createYearOptions()}
            </select>
          </div>
        )}
        {/* Total revenue */}
        <div className={`d-flex ${rtl ? '' : 'flex-row-reverse'}`}>
          <div className='flex-1'>
            <LineMulBlack
              title={title.total}
              labels={labels}
              set={chartTotal}
              onClick={index => {
                setSelectedSum(index);
              }}
            />
          </div>
          <div className={`flex-1 ${rtl ? 'pl-4' : 'pr-4'}`}>
            <div className='box-statistic d-flex flex-column mb-3'>
              <span className='font-short-big font-gray-dark'>
                {type === 'year' ? 'Selected year' : 'Selected date'}
              </span>
              <span className='font-short-extra'>
                {type === 'year'
                  ? labels[selectedSum]
                  : `${labels[selectedSum]} ${form.year}`}
              </span>
            </div>
            <div className='box-statistic d-flex flex-column mb-3'>
              <span className='font-short-big font-gray-dark'>
                Total revenue
              </span>
              <span className='font-short-extra font-blue-main'>
                {chartTotal[0].data[selectedSum]} {currency}
              </span>
            </div>
          </div>
        </div>
        {/* Comparison revenue */}
        <div className={`d-flex mt-3 ${rtl ? '' : 'flex-row-reverse'}`}>
          <div className='flex-1'>
            <LineMulBlack
              title={title.comparison}
              labels={labels}
              set={chartComparison}
              onClick={index => {
                setSelectedComparison(index);
              }}
            />
          </div>
          <div className={`flex-1 ${rtl ? 'pl-4' : 'pr-4'}`}>
            <div className='box-statistic d-flex flex-column mb-3'>
              <span className='font-short-big font-gray-dark'>
                {type === 'year' ? 'Selected year' : 'Selected date'}
              </span>
              <span className='font-short-extra'>
                {type === 'year'
                  ? labels[selectedComparison]
                  : `${labels[selectedComparison]} ${form.year}`}
              </span>
            </div>
            <div className='box-statistic d-flex flex-column mb-3'>
              <span className='font-short-big font-gray-dark'>
                Fixed revenue
              </span>
              <span className='font-short-extra font-green'>
                {chartComparison[0].data[selectedComparison]} {currency}
              </span>
            </div>
            <div className='box-statistic d-flex flex-column'>
              <span className='font-short-big font-gray-dark'>
                Monthly subscription revenue
              </span>
              <span className='font-short-extra font-purple'>
                {chartComparison[1].data[selectedComparison]} {currency}
              </span>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

const getRevenue = (token, type, start, end, month, year) => {
  if (type === 'year') {
    return getRevenueYear(token, start, end);
  } else {
    return getRevenueMonth(token, month, year);
  }
};

export default Revenue;
