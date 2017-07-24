import { scaleLinear, scaleBand } from 'd3-scale'
import { max } from 'd3-array';
import { select, selectAll } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import { conventions, f } from 'd3-jetpack';
import { update, head, unset } from 'lodash';

const ƒ = f;

export default (d3data, port) => {
  const renderChart = (d, i, n) => {
    const data = d.data;
    const node = d.node;
    // docs say this === n[i] but this is undefined ...
    const { x, y, xAxis, yAxis, height, width, svg, drawAxis } = updateChart(n[i], data);

    const xg = svg.selectAll(".x.axis")
      .data([data])
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    xg.enter()
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    const yg = svg.selectAll(".y.axis")
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

    const barG = svg.selectAll(".bar")
      .data(data);

    barG.enter().append("rect")
      .attr("class", "bar")
    .merge(barG)
      .attr("x", d => { return x(d[0]); })
      .attr("width", x.bandwidth())
      .attr("y", d => { return y(d[1]); })
      .attr("height", d => { return height - y(d[1]); })
      .on('click', d => {
        port([node, d]);
      });
  }

  const init = (d, i, n) => {
    const sel = select(n[i]);
    const rect = n[i].getBoundingClientRect();
    const chart = conventions({parentSel: sel,
      margin: {top: 20, right: 20, bottom: 30, left: 40},
      totalWidth: rect.width,
      totalHeight: rect.height
    });

    const x = scaleBand()
      .range([0, chart.width])
      .paddingInner(0.1)
      .round(0.1);

    const xAxis = axisBottom()
      .scale(x);

    update(chart, 'yAxis', yAxis => yAxis.ticks(5, '%')); // modify yAxis to add formatting
    update(chart, 'x', () => x)
    update(chart, 'xAxis', () => xAxis)

    sel.select('svg').data([chart]); // needs to be an array
  }

  const updateChart = (node, data) => {
    // do NOT select('svg') here or we get data bound to parent ... ???
    const svgNode = select(node).selectAll('svg');
    const chart = head(svgNode.data());
    const rect = node.getBoundingClientRect();
    // these to if statements only needed to support dynamic resizing
    if (rect.width !== chart.totalWidth) {
      chart.totalWidth = rect.width
      chart.width = rect.width - chart.margin.left - chart.margin.right
      update(chart, 'x', x => x.range([0, chart.width]))
      svgNode.attr('width', rect.width)
    }
    if (rect.height !== chart.totalHeight) {
      chart.totalHeight = rect.height
      chart.height = rect.height - chart.margin.top - chart.margin.bottom
      update(chart, 'y', y => y.range([chart.height, 0]))
      svgNode.attr('height', rect.height)
    }
    update(chart, 'x', x => x.domain(data.map(d => { return d[0]; })));
    update(chart, 'y', y => y.domain([0, max(data, d => { return d[1]; })]))

    svgNode.data([chart]);
    return chart;
  }

  const wrap = selectAll('.d3-wrapper').data(d3data);
  const inner = wrap.selectAll('.d3-inner').data(d => [d]);
  inner.enter().append('div.d3-inner').each(init).merge(inner)
    .each(renderChart);

}

