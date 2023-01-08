const CHART_MARGIN = {
  TOP: 150,
  RIGHT: 150,
  BOTTOM: 150,
  LEFT: 150
};
const CHART_WIDTH = 1000 - CHART_MARGIN.LEFT - CHART_MARGIN.RIGHT;
const CHART_HEIGHT = 600 - CHART_MARGIN.TOP - CHART_MARGIN.BOTTOM;

const CHART_DIV = d3.select("#chart");

const TOOLTIP = d3
  .select("body")
  .append("div")
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
  .attr("y", -70)
  .text("Doping in Professional Bicycle Racing");

CHART.append("text")
  .attr("id", "sub-title")
  .attr("x", CHART_WIDTH / 2)
  .attr("y", -40)
  .text("35 Fastest times up Alpe d'Huez");

CHART.append("text")
  .attr("id", "x-axis-legend")
  .attr("x", CHART_WIDTH / 2)
  .attr("y", CHART_HEIGHT + 65)
  .text("Year");

CHART.append("text")
  .attr("id", "y-axis-legend")
  .attr("transform", "rotate(-90)")
  .attr("x", -(CHART_HEIGHT / 2))
  .attr("y", -95)
  .text("Time (Minutes)");

const LEGEND = CHART.append("g").attr("id", "legend");

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
).then((data) => {
  const PARSE_MINUTES_SECONDS = d3.timeParse("%M:%S");
  const PARSE_YEAR = d3.timeParse("%Y");

  data.forEach((race) => {
    race.Time = PARSE_MINUTES_SECONDS(race.Time);
    race.Year = PARSE_YEAR(race.Year);
  });
  const CHART_DATA = data;

  const COLOR_VALUE = (value) => {
    return value.Doping !== "";
  };
  const COLOR = d3.scaleOrdinal(["red", "green"]);

  const X_DATA_MIN = d3.min(CHART_DATA.map((race) => race.Year));
  const X_DATA_MAX = d3.max(CHART_DATA.map((race) => race.Year));
  const X_SCALE_MIN = new Date(X_DATA_MIN).setFullYear(
    X_DATA_MIN.getFullYear() - 1
  );
  const X_SCALE_MAX = new Date(X_DATA_MAX).setFullYear(
    X_DATA_MAX.getFullYear() + 1
  );

  const X_SCALE = d3
    .scaleTime()
    .domain([X_SCALE_MIN, X_SCALE_MAX])
    .range([0, CHART_WIDTH]);

  const X_AXIS = d3
    .axisBottom()
    .scale(X_SCALE)
    .tickFormat(d3.timeFormat("%Y"))
    .tickSizeOuter(0);

  CHART.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + CHART_HEIGHT + ")")
    .call(X_AXIS);

  const Y_DATA_MIN = d3.min(CHART_DATA.map((race) => race.Time));
  const Y_DATA_MAX = d3.max(CHART_DATA.map((race) => race.Time));
  const Y_SCALE_MIN = new Date(Y_DATA_MIN).setSeconds(
    Y_DATA_MIN.getSeconds() - 15
  );
  const Y_SCALE_MAX = new Date(Y_DATA_MAX).setSeconds(
    Y_DATA_MAX.getSeconds() + 15
  );

  const Y_SCALE = d3
    .scaleTime()
    .domain([Y_SCALE_MAX, Y_SCALE_MIN])
    .range([CHART_HEIGHT, 0]);

  const Y_AXIS = d3
    .axisLeft()
    .scale(Y_SCALE)
    .tickFormat(d3.timeFormat("%M:%S"))
    .tickSizeOuter(0);

  CHART.append("g").attr("id", "y-axis").call(Y_AXIS);

  CHART.selectAll(".dot")
    .data(CHART_DATA)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => d.Time)
    .attr("r", 8)
    .attr("cx", (d) => X_SCALE(d.Year))
    .attr("cy", (d) => Y_SCALE(d.Time))
    .style("fill", (d) => COLOR(COLOR_VALUE(d)))
    .on("mouseover", (d) => {
    console.log(d3.event.pageY)
      TOOLTIP.attr("data-year", d.Year)
        .html(
          d.Name +
            "<br>" +
            "Country: " +
            d.Nationality +
            "<br>" +
            "Year: " +
            d.Year.getFullYear() +
            "<br>" +
            "Time: " +
            d.Time.getMinutes() +
            ":" +
            d.Time.getSeconds() +
            "<br><br>" +
            d.Doping
        )
        .style("left", d3.event.pageX + 20 + "px")
        .style("top", d3.event.pageY  + 10 +  "px");
      TOOLTIP.transition().duration(200).style("opacity", 0.9);
    })
    .on("mouseout", (d) => {
      TOOLTIP.transition().duration(200).style("opacity", 0);
    });
  const LEGEND_LABEL = LEGEND.selectAll(".legend-label")
    .data(COLOR.domain())
    .enter()
    .append("g")
    .attr("class", "legend-label")
    .attr("transform", (d, i) => {
      return (
        "translate(0," +
        ((CHART_HEIGHT - CHART_MARGIN.BOTTOM) / 2 - i * 20) +
        ")"
      );
    });
  LEGEND_LABEL.append("rect")
    .attr("x", CHART_WIDTH - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", COLOR);

  LEGEND_LABEL.append("text")
    .attr("x", CHART_WIDTH - 24)
    .attr("y", 9)
    .attr("dy", ".1rem")
    .style("text-anchor", "end")
    .text(function (d) {
      if (d) {
        return "Riders with doping allegations";
      } else {
        return "No doping allegations";
      }
    });
});
