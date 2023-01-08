const CHART_MARGIN = {
  TOP: 150,
  RIGHT: 0,
  BOTTOM: 150,
  LEFT: 100
};

const CHART_WIDTH = 1100 - CHART_MARGIN.LEFT - CHART_MARGIN.RIGHT;
const CHART_HEIGHT = 850 - CHART_MARGIN.TOP - CHART_MARGIN.BOTTOM;
const LEGEND_WIDTH = 400;

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
  .text("United States Educational Attainment");

CHART.append("text")
  .attr("id", "description")
  .attr("x", CHART_WIDTH / 2)
  .attr("y", -40)
  .text(
    "Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)"
  );

const LEGEND = CHART.append("g")
  .attr("id", "legend")
  .attr(
    "transform",
    "translate(" + (CHART_WIDTH / 2 - LEGEND_WIDTH / 2) + "," + 650 + ")"
  );

const EDU_URL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const COUNTIES_URL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

const FIND_MATCHING_COUNTY = (arr, d) => arr.find((obj) => obj.fips === d.id);

const READY = (data) => {
  const DEGREE_DATA = data[0];
  const COUNTY_DATA = topojson.feature(data[1], data[1].objects.counties)
    .features;
  const DEGREE_EXTENT = d3.extent(
    DEGREE_DATA.map((obj) => obj.bachelorsOrHigher)
  );
  const DEGREE_MIN = DEGREE_EXTENT[0];
  const DEGREE_MAX = DEGREE_EXTENT[1];

  const COLORS = d3
    .scaleQuantile()
    .domain([DEGREE_MIN, DEGREE_MAX])
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

  CHART.append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(COUNTY_DATA)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county")
    .attr("data-fips", (d) => d.id)
    .attr("data-education", (d) => {
      let county = FIND_MATCHING_COUNTY(DEGREE_DATA, d);
      return county ? county.bachelorsOrHigher : 0;
    })
    .attr("fill", (d) => {
      let county = FIND_MATCHING_COUNTY(DEGREE_DATA, d);
      return county ? COLORS(county.bachelorsOrHigher) : COLORS(0);
    })
    .on("mouseover", (d) => {
      TOOLTIP.html(() => {
        let county = FIND_MATCHING_COUNTY(DEGREE_DATA, d);
        if (county) {
          return (
            county.area_name +
            ", " +
            county.state +
            ": " +
            county.bachelorsOrHigher +
            "%"
          );
        }
      })
        .attr("data-education", () => {
          let county = FIND_MATCHING_COUNTY(DEGREE_DATA, d);
          return county ? county.bachelorsOrHigher : 0;
        })
        .style("left", d3.event.pageX + 20 + "px")
        .style("top", d3.event.pageY + 10 + "px")
        .transition()
        .duration(200)
        .style("opacity", 0.9);
    })
    .on("mouseout", (d) => {
      TOOLTIP.transition().duration(200).style("opacity", 0);
    });

  const LEGEND_SCALE = d3
    .scaleLinear()
    .domain([DEGREE_MIN, DEGREE_MAX])
    .range([0, LEGEND_WIDTH]);

  const LEGEND_AXIS = d3
    .axisBottom()
    .scale(LEGEND_SCALE)
    .tickSize(13)
    .tickFormat((x) => {
      return Math.round(x) + "%";
    })
    .tickValues(COLORS.quantiles());

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
    .text("Percentage with a bachelor's degree");

  LEGEND.call(LEGEND_AXIS).select(".domain").remove();
};

Promise.all([fetch(EDU_URL), fetch(COUNTIES_URL)])
  .then((responses) => {
    return Promise.all(
      responses.map((response) => {
        return response.json();
      })
    );
  })
  .then((data) => {
    READY(data);
  })
  .catch((error) => {
    console.log(error);
  });
