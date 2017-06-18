import { scaleLinear, scaleBand } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-jetpack'
import { SvgChart } from 'd3kit';
import { axisBottom, axisLeft } from 'd3-axis';



export default (data, port) => {
  let chart = new SvgChart('#d3-wrapper', {
    margin: {top: 20, right: 20, bottom: 30, left: 40},
    initialWidth: 890,
    initialHeight: 500
  });

  chart.fit({width: '100%'}, true);
  chart.on("resize", (w, h) => {
    chart.width(w);
    chart.height(h);
    render();
  });

  const render = () => {

  let x = scaleBand()
    .range([0, chart.getInnerWidth()])
    .paddingInner(0.1)
    .round(0.1);

  let y = scaleLinear()
    .range([chart.getInnerHeight(), 0]);

  let xAxis = axisBottom()
    .scale(x);

  let yAxis = axisLeft()
    .scale(y)
    .ticks(10, "%");

  x.domain(data.map(d => { return d[0]; }));
  y.domain([0, max(data, d => { return d[1]; })]);

    let xg = chart.rootG.selectAll(".x.axis")
      .data([data])
      .attr("transform", "translate(0," + chart.getInnerHeight() + ")")
      .call(xAxis);

    xg.enter()
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + chart.getInnerHeight() + ")")
      .call(xAxis);

    let yg = chart.rootG.selectAll(".y.axis")
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

    let barG = chart.rootG.selectAll(".bar")
      .data(data)
      .attr("x", d => { return x(d[0]); })
      .attr("width", x.bandwidth())
      .attr("y", d => { return y(d[1]); })
      .attr("height", d => { return chart.getInnerHeight() - y(d[1]); });

    barG.enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => { return x(d[0]); })
      .attr("width", x.bandwidth())
      .attr("y", d => { return y(d[1]); })
      .attr("height", d => { return chart.getInnerHeight() - y(d[1]); })
      .on('click', d => {
        port(d);
      });
  }
}

