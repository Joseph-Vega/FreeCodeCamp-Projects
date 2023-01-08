const CHART_MARGIN = {
  TOP: 150,
  RIGHT: 50,
  BOTTOM: 100,
  LEFT: 150
};
const CHART_WIDTH = 1000 - CHART_MARGIN.LEFT - CHART_MARGIN.RIGHT;
const CHART_HEIGHT = 600 - CHART_MARGIN.TOP - CHART_MARGIN.BOTTOM;

const CHART_DIV = d3.select("#chart");

const TOOLTIP = CHART_DIV.append("text")
  .attr("id", "tooltip")
  .style("opacity", 0);

const CHART_SVG = CHART_DIV.append("svg")
  .attr("width", CHART_WIDTH + CHART_MARGIN.LEFT + CHART_MARGIN.RIGHT)
  .attr("height", CHART_HEIGHT + CHART_MARGIN.TOP + CHART_MARGIN.BOTTOM);

const CHART = CHART_SVG.append("g")
  .attr("id", "chart-area")
  .attr(
    "transform",
    "translate(" + CHART_MARGIN.LEFT + ", " + CHART_MARGIN.TOP + ")"
  );

CHART.append("text")
  .attr("id", "title")
  .attr("x", CHART_WIDTH / 2)
  .attr("y", -50)
  .text("U.S. Quarterly GDP");

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
).then((data) => {
  const CHART_DATA = data.data;

  const X_MIN = d3.min(CHART_DATA.map((quarter) => new Date(quarter[0])));
  const X_MAX = d3.max(CHART_DATA.map((quarter) => new Date(quarter[0])));
  const X_SCALE = d3
    .scaleTime()
    .domain([X_MIN, X_MAX])
    .range([0, CHART_WIDTH])
    .nice(d3.timeYear);

  const X_AXIS = d3.axisBottom().scale(X_SCALE);

  CHART.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + CHART_HEIGHT + ")")
    .call(X_AXIS);

  CHART.append("text")
    .attr("id", "x-axis-legend")
    .attr("x", CHART_WIDTH / 2)
    .attr("y", CHART_HEIGHT + 65)
    .text("Quarters");

  const Y_MIN = 0;
  const Y_MAX = d3.max(CHART_DATA.map((quarter) => quarter[1]));
  const Y_SCALE = d3
    .scaleLinear()
    .domain([Y_MIN, Y_MAX])
    .range([CHART_HEIGHT, 0]);

  const Y_AXIS = d3.axisLeft().scale(Y_SCALE);

  CHART.append("g").attr("id", "y-axis").call(Y_AXIS);

  CHART.append("text")
    .attr("id", "y-axis-legend")
    .attr("transform", "rotate(-90)")
    .attr("x", -(CHART_HEIGHT / 2))
    .attr("y", -95)
    .text("U.S. GDP in Billions");

  CHART.selectAll("rect")
    .data(CHART_DATA)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => X_SCALE(new Date(d[0])))
    .attr("y", (d) => Y_SCALE(d[1]))
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .attr("width", CHART_WIDTH / CHART_DATA.length)
    .attr("height", (d) => CHART_HEIGHT - Y_SCALE(d[1]))
    .on("mouseover", (d, i) => {
      TOOLTIP.html(
        "<span>$" +
          d[1].toLocaleString("en-US", { minimumFractionDigits: 2 }) +
          " Billion</span><br><span>" +
          d[0] +
          "</span>"
      )
        .attr("data-date", d[0])
        .style(
          "left",
          CHART_MARGIN.LEFT + i * (CHART_WIDTH / CHART_DATA.length) + "px"
        )
        .style(
          "bottom",
          CHART_HEIGHT + CHART_MARGIN.BOTTOM - Y_SCALE(d[1]) + 20 + "px"
        );
      TOOLTIP.transition().duration(200).style("opacity", 0.8);
    })
    .on("mouseout", () => {
      TOOLTIP.transition().duration(200).style("opacity", 0);
    });
});
