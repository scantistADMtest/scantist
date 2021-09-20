import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export const Chart = (props) => {
  let { data } = props;
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  data.map(
    (hero) =>
      (hero["win_rates"] = Number(
        ((hero.pro_win / hero.pro_pick) * 100).toFixed(2)
      ))
  );
  const svgRef = useRef(null);

  useEffect(() => {
    function setDimensionsState() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", setDimensionsState);

    return () => window.removeEventListener("resize", setDimensionsState);
  }, [dimensions]);

  useEffect(() => {
    d3.selectAll("g").remove();
    BarChart(data);
  }, [dimensions, data]);

  const margin = { top: 50, right: 36, bottom: 30, left: 36 };

  function BarChart(data) {
    const chartwidth = parseInt(d3.select("#d3chart").style("width"));
    const chartheight =
      parseInt(d3.select("#d3chart").style("height")) -
      margin.top -
      margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", chartwidth)
      .attr("height", chartheight + margin.top + margin.bottom);

    const xScale = d3
      .scaleBand()
      .domain(d3.range(data.length))
      .range([margin.left, chartwidth])
      .padding(0.2);

    const max = d3.max(data, function (d) {
      return 100 * Math.ceil(d.pro_pick / 100);
    });

    const yScale = d3
      .scaleLinear()
      .domain([0, max])
      .range([chartheight, margin.top]);

    // setting up axis
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(data.length)
      .tickFormat((i) => data[i].localized_name)
      .tickSizeOuter(0);

    const yAxis = d3.axisLeft(yScale).ticks(10);

    if (window.innerWidth < 880) {
      svg
        .append("g")
        .call(xAxis)
        .attr("transform", "translate(0," + chartheight + ")")
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-0.75rem")
        .attr("dy", "0.25rem")
        .attr("transform", "rotate(-65)")
        .style("color", "#1c1c1c")
        .style("font-size", "0.75rem")
        .style("font-weight", "600");
    } else {
      svg
        .append("g")
        .call(xAxis)
        .attr("transform", "translate(0," + chartheight + ")")
        .selectAll("text")
        .attr("dy", "1rem")
        .style("color", "#1c1c1c")
        .style("font-size", "1rem")
        .style("font-weight", "600");
    }

    if (window.innerWidth < 880) {
      svg
        .append("g")
        .call(yAxis)
        .attr("transform", "translate(" + margin.left + ",0)")
        .style("color", "#1c1c1c")
        .style("font-size", "0.75rem")
        .attr("class", "yAxis");
    } else {
      svg
        .append("g")
        .call(yAxis)
        .attr("transform", "translate(" + margin.left + ",0)")
        .style("color", "#1c1c1c")
        .style("font-size", "1rem")
        .attr("class", "yAxis");
    }

    d3.selectAll("g.yAxis g.tick")
      .append("line")
      .attr("class", "gridline")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", chartwidth)
      .attr("y2", 0);

    svg
      .append("g")
      .attr("fill", "#da4126")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d, i) => xScale(i))
      .attr("y", (d) => yScale(d.pro_pick))
      .attr("height", (d) => yScale(0) - yScale(d.pro_pick))
      .attr("width", xScale.bandwidth());
  }

  return (
    <div id="d3chart">
      <svg ref={svgRef}></svg>
    </div>
  );
};
