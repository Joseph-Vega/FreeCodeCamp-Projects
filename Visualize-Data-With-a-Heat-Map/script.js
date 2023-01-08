const CHART_MARGIN = {
  TOP: 150,
  RIGHT: 150,
  BOTTOM: 150,
  LEFT: 150
};
const CHART_WIDTH = 1400 - CHART_MARGIN.LEFT - CHART_MARGIN.RIGHT;
const CHART_HEIGHT = 600 - CHART_MARGIN.TOP - CHART_MARGIN.BOTTOM;
const LEGEND_WIDTH = 400;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const TOOLTIP = d3
  .select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

const CHART_DIV = d3.select("#chart");

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
  .attr("y", -70)
  .text("Monthly Global Surface Temperature");

CHART.append("text")
  .attr("id", "description")
  .attr("x", CHART_WIDTH / 2)
  .attr("y", -40)
  .text("1753 - 2015: base temperature 8.66 ℃");

const LEGEND = CHART.append("g")
  .attr("id", "legend")
  .attr(
    "transform",
    "translate(" + (CHART_WIDTH / 2 - LEGEND_WIDTH / 2) + "," + 375 + ")"
  );

d3.json(
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json"
).then((data) => {
  const CHART_DATA = data;

  const BASE_TEMP = CHART_DATA.baseTemperature;
  const TEMP_EXTENT = d3.extent(
    CHART_DATA.monthlyVariance.map((obj) => BASE_TEMP + obj.variance)
  );
  const TEMP_MIN = TEMP_EXTENT[0];
  const TEMP_MAX = TEMP_EXTENT[1];

  const COLORS = d3
    .scaleQuantile()
    .domain([TEMP_MIN, TEMP_MAX])
    .range([
      "#5E4FA2",
      "#3288BD",
      "#66C2A5",
      "#ABDDA4",
      "#E6F598",
      "#FFFFBF",
      "#FEE08B",
      "#FDAE61",
      "#F46D43",
      "#D53E4F",
      "#9E0142"
    ]);

  const Y_SCALE = d3
    .scaleBand()
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    .range([CHART_HEIGHT, 0])
    .round(true);

  const Y_AXIS = d3
    .axisLeft()
    .scale(Y_SCALE)
    .tickFormat((d) => MONTHS[d])
    .tickSizeOuter(0);

  const X_SCALE = d3
    .scaleBand()
    .domain(CHART_DATA.monthlyVariance.map((obj) => obj.year))
    .range([0, CHART_WIDTH]);

  const X_AXIS = d3
    .axisBottom()
    .scale(X_SCALE)
    .tickValues(X_SCALE.domain().filter((year) => year % 10 === 0))
    .tickSizeOuter(0);

  const LEGEND_SCALE = d3
    .scaleLinear()
    .domain([TEMP_MIN, TEMP_MAX])
    .range([0, LEGEND_WIDTH]);

  const LEGEND_AXIS = d3
    .axisBottom()
    .scale(LEGEND_SCALE)
    .tickSize(13)
    .tickFormat(d3.format(".1f"))
    .tickValues(COLORS.quantiles());

  CHART.selectAll("rect")
    .data(CHART_DATA.monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", (d) => d.month - 1)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => BASE_TEMP + d.variance)
    .attr("height", (d) => Y_SCALE.bandwidth(d.month))
    .attr("width", (d) => X_SCALE.bandwidth(d.year))
    .attr("x", (d) => X_SCALE(d.year))
    .attr("y", (d) => Y_SCALE(d.month - 1))
    .attr("fill", (d) => COLORS(BASE_TEMP + d.variance))
    .on("mouseover", (d) => {
      TOOLTIP.attr("data-year", d.year)
        .html(
          d.year +
            " - " +
            MONTHS[d.month - 1] +
            "<br>" +
            d3.format(".1f")(BASE_TEMP + d.variance) +
            " &#8451;" +
            "<br>" +
            d3.format("+.1f")(d.variance) +
            " &#8451;"
        )
        .style("left", d3.event.pageX + 20 + "px")
        .style("top", d3.event.pageY + 10 + "px");
      TOOLTIP.transition().duration(200).style("opacity", 0.9);
    })
    .on("mouseout", (d) => {
      TOOLTIP.transition().duration(200).style("opacity", 0);
    });

  CHART.append("g").attr("id", "y-axis").call(Y_AXIS);

  CHART.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + CHART_HEIGHT + ")")
    .call(X_AXIS);

  LEGEND.selectAll("rect")
    .data(COLORS.range().map((d) => COLORS.invertExtent(d)))
    .enter()
    .append("rect")
    .attr("height", 8)
    .attr("x", (d) => {
      return LEGEND_SCALE(d[0]);
    })
    .attr("width", (d) => LEGEND_WIDTH / COLORS.range().length)
    .attr("fill", (d) => {
      return COLORS(d[0]);
    });

  LEGEND.append("text")
    .attr("id", "legend-caption")
    .attr("x", 0)
    .attr("y", -5)
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text("Temperature (℃)");

  LEGEND.call(LEGEND_AXIS).select(".domain").remove();
});