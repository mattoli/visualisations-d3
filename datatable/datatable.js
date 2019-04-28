// Set globals
const url = "https://api.iextrading.com/1.0/"
const endpoint = "tops/last"
var data;

// get the data
d3.json(url+endpoint).then(function(json) { 
  dataTable(json);
});

// datatable function
function dataTable(data) {

  // extract keys from data
  var keys = Object.keys(data[0])

  // append table, thead, tbody
  var table = d3.select("body")
                .append("table")
                .attr("class", "table table-hover table-dark")
  var thead = table.append("thead")
  var tbody = table.append("tbody")

  // create header row
  thead.append("tr")
       .selectAll("th")
       .data(keys)
       .enter()
       .append("th")
       .attr("class", "h2")
       .text( function(k) {
        return k.replace("_", " ");
       });

  // create rows
  var rows = tbody.selectAll("tr")
                  .data(data)
                  .enter()
                  .append("tr")
  
  // create cols for each row
  var cols = rows.selectAll('td')
      .data(function (row) {
        return keys.map(function (col) {
          return {c: col, v: row[col]};
        });
      })
      .enter()
      .append('td')
      .text(function (d) { return d.v; });

  return table;
}