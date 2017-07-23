import { scaleLinear, scaleBand } from 'd3-scale'
import { max } from 'd3-array';
import { select, selectAll } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import { conventions, f } from 'd3-jetpack';
import { extend } from 'lodash';

const ƒ = f;

export default (d3data, port) => {
  const renderChart = (d, i, n) => {
    const svg = select(n[i]).selectAll('svg'); // do NOT select here

    const chart = svg.data()[0];
    const data = d.data;
    const node = d.node;
    console.log(chart);

  let x = scaleBand()
    .range([0, chart.width])
    .paddingInner(0.1)
    .round(0.1);

  let y = scaleLinear()
    .range([chart.height, 0]);

  let xAxis = axisBottom()
    .scale(x);

  let yAxis = axisLeft()
    .scale(y)
    .ticks(10, "%");
  x.domain(data.map(d => { return d[0]; }));
  y.domain([0, max(data, d => { return d[1]; })]);

    let xg = chart.svg.selectAll(".x.axis")
      .data([data])
      .attr("transform", "translate(0," + chart.height + ")")
      .call(xAxis);

    xg.enter()
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + chart.height + ")")
      .call(xAxis);

    let yg = chart.svg.selectAll(".y.axis")
      .data([data])
      .call(yAxis);

    yg.enter().append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");

    let barG = chart.svg.selectAll(".bar")
      .data(data)
      .attr("x", d => { return x(d[0]); })
      .attr("width", x.bandwidth())
      .attr("y", d => { return y(d[1]); })
      .attr("height", d => { return chart.height - y(d[1]); });

    barG.enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => { return x(d[0]); })
      .attr("width", x.bandwidth())
      .attr("y", d => { return y(d[1]); })
      .attr("height", d => { return chart.height - y(d[1]); })
      .on('click', d => {
        port([node, d]);
      });

  }
  const init = (d, i, n) => {
    const sel = select(n[i]);
    const chart = conventions({parentSel: sel,
      margin: {top: 20, right: 20, bottom: 30, left: 40},
      totalWidth: 890,
      totalHeight: 500
    });

    sel.select('svg').data([chart]);
  }
  const wrap = selectAll('.d3-wrapper').data(d3data);
  const wrapEnter = wrap.enter().append('div.d3-wrapper');
  
  const inner = wrap.selectAll('.d3-inner').data(d => [d]);
  inner.enter().append('div.d3-inner').each(init).merge(inner)
    .each(renderChart);
  
  
}

