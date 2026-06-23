const CATEGORY_COLORS = {
  "Science":       "#4e9af1",
  "Art & Science": "#e8a838",
  "Philosophy":    "#a87be8",
  "Music":         "#4ec9a8",
  "Politics":      "#e86e6e",
  "Literature":    "#78c87a",
};

const DEFAULT_COLOR = "#888";

const BAR_HEIGHT   = 22;
const BAR_PADDING  = 6;
const ROW_HEIGHT   = BAR_HEIGHT + BAR_PADDING;
const MARGIN       = { top: 40, right: 20, bottom: 40, left: 180 };
const MIN_LABEL_WIDTH = 60;

let allPeople = [];

function color(category) {
  return CATEGORY_COLORS[category] || DEFAULT_COLOR;
}

function render(people) {
  d3.select("#chart-container").selectAll("*").remove();

  const width  = Math.max(window.innerWidth - 32, 800);
  const height = MARGIN.top + MARGIN.bottom + people.length * ROW_HEIGHT;

  const xMin = d3.min(people, d => d.born) - 10;
  const xMax = d3.max(people, d => d.died) + 10;

  const x = d3.scaleLinear()
    .domain([xMin, xMax])
    .range([MARGIN.left, width - MARGIN.right]);

  const svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Grid lines
  const ticks = x.ticks(10);
  svg.selectAll(".grid-line")
    .data(ticks)
    .enter().append("line")
    .attr("class", "grid-line")
    .attr("x1", d => x(d)).attr("x2", d => x(d))
    .attr("y1", MARGIN.top)
    .attr("y2", height - MARGIN.bottom);

  // Axes
  const axisTop    = d3.axisTop(x).ticks(10).tickFormat(d => Math.abs(d) + (d < 0 ? " BCE" : ""));
  const axisBottom = d3.axisBottom(x).ticks(10).tickFormat(d => Math.abs(d) + (d < 0 ? " BCE" : ""));

  svg.append("g")
    .attr("class", "axis-top")
    .attr("transform", `translate(0, ${MARGIN.top})`)
    .call(axisTop);

  svg.append("g")
    .attr("class", "axis-bottom")
    .attr("transform", `translate(0, ${height - MARGIN.bottom})`)
    .call(axisBottom);

  // Tooltip
  const tooltip = d3.select("#tooltip");

  // Rows
  const rows = svg.selectAll(".row")
    .data(people)
    .enter().append("g")
    .attr("class", "row")
    .attr("transform", (d, i) => `translate(0, ${MARGIN.top + i * ROW_HEIGHT + BAR_PADDING / 2})`);

  // Name label (left side)
  rows.append("text")
    .attr("class", "bar-label")
    .attr("x", MARGIN.left - 8)
    .attr("y", BAR_HEIGHT / 2)
    .attr("text-anchor", "end")
    .text(d => d.name);

  // Lifespan bar
  rows.append("rect")
    .attr("class", "bar")
    .attr("x",      d => x(d.born))
    .attr("y",      0)
    .attr("width",  d => Math.max(2, x(d.died) - x(d.born)))
    .attr("height", BAR_HEIGHT)
    .attr("fill",   d => color(d.category))
    .attr("opacity", 0.8)
    .on("mousemove", function(event, d) {
      const lifespan = d.died - d.born;
      tooltip
        .style("opacity", 1)
        .style("left", (event.clientX + 14) + "px")
        .style("top",  (event.clientY - 28) + "px")
        .html(`<strong>${d.name}</strong>
               <span>${d.born}–${d.died} <span class="years">(${lifespan} años)</span></span><br>
               <span style="color:${color(d.category)}">${d.category}</span>`);
    })
    .on("mouseleave", () => tooltip.style("opacity", 0));
}

function populateCategoryFilter(people) {
  const categories = ["Todos", ...new Set(people.map(d => d.category).sort())];
  const sel = d3.select("#category-filter");
  sel.selectAll("option").remove();
  categories.forEach(cat => sel.append("option").attr("value", cat).text(cat));
}

function applyFilter() {
  const cat = document.getElementById("category-filter").value;
  const filtered = cat === "Todos" ? allPeople : allPeople.filter(d => d.category === cat);
  render(filtered);
}

// Load data and init
d3.json("public/data/people.json").then(data => {
  allPeople = data.sort((a, b) => a.born - b.born);
  populateCategoryFilter(allPeople);
  render(allPeople);
});

document.getElementById("category-filter").addEventListener("change", applyFilter);
window.addEventListener("resize", applyFilter);
