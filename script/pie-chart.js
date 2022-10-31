async function createPieChart() {
  const response = await fetch(
    "https://api.spaceflightnewsapi.net/v3/articles?_limit=100"
  );
  const data = await response.json();
  let sites = [];
  data.forEach((site) => {
    sites.push(site.newsSite);
  });

  let chartLabels = [];
  //chartLabels.push(sites[0])
  sites.sort();
  let siteData = [];

  for (let i = 0; i <= sites.length; i++) {
    let currentSite = sites[i];
    let prevSite = sites[i - 1];

    if (currentSite !== prevSite) {
      chartLabels.push(currentSite);
      siteData.push(1);
    } else if (currentSite == prevSite) {
      let labelIndex = chartLabels.indexOf(currentSite);
      siteData[labelIndex] += 1;
    }
  }

  chartLabels.pop();
  siteData.pop();
  siteData.forEach((num) => {
    num *= 10;
    return num;
  });

  const ctx = document.getElementById("pieChart");
  const myChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: chartLabels,
      datasets: [
        {
          data: siteData,
          backgroundColor: [
            "rgb(135, 216, 96)",
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 206, 86)",
            "rgb(75, 192, 192)",
            "rgb(153, 102, 255)",
            "rgb(255, 159, 64)",
          ],
          borderColor: [
            "rgb(135, 216, 96, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Siti di pubblicazioni dell'articolo in %",
        },
      },
    },
  });

  const grafico = document.querySelector(".div-gigante");
  grafico.style.display = "none";

  const chart = document.querySelector('#myChart');
  monthSelect.addEventListener("change", (e) => {
    fetchStats(e.target.value);
  });
}

function fetchStats(monthStat) {
  const today = new Date();
  const day = twoDayDigit(today);
  //const month = twoMonthDigit(today);
  const year = today.getFullYear();
  const fullDate = `${year}-${monthStat}-${day}`;

  fetchApiData(
    `articles?publishedAt_lt=${year}-${("0" + (parseInt(monthStat) + 1)).slice(
      -2
    )}-01&publishedAt_gte=${fullDate}&_limit=${LIMIT}`
  )
    .then((data) => {
      let sites = [];
      data.forEach((site) => {
        sites.push(site.newsSite);
      });

      let chartLabels = [];
      //chartLabels.push(sites[0])
      sites.sort();
      let siteData = [];

      for (let i = 0; i <= sites.length; i++) {
        let currentSite = sites[i];
        let prevSite = sites[i - 1];

        if (currentSite !== prevSite) {
          chartLabels.push(currentSite);
          siteData.push(1);
        } else if (currentSite == prevSite) {
          let labelIndex = chartLabels.indexOf(currentSite);
          siteData[labelIndex] += 1;
        }
      }

      chartLabels.pop();
      console.log(chartLabels)
      siteData.pop();

      if (myBarChart instanceof Chart){
        myBarChart.destroy();
      }


      

      const canvas = document.createElement('canvas');
      canvas.setAttribute('id', 'myChart');
      const barContainer = document.querySelector('.grafico_bar');
      const prevCanvas = barContainer.querySelector('canvas');
      prevCanvas.remove();
      barContainer.append(canvas);

      const ctx2 = document.querySelector("#myChart").getContext("2d");
        
       myBarChart = new Chart(ctx2, {
        type: "bar",
        data: {
          labels: chartLabels,
          datasets: [
            {
              data: siteData,
              label: 'Num of articles',
              backgroundColor: [
                "rgba(255, 99, 132)",
                "rgba(54, 162, 235)",
                "rgba(255, 206, 86)",
                "rgba(46, 204, 113)",
                "rgba(153, 102, 255)",
                "rgba(255, 159, 64)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(46, 204, 113, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              labels: {
                color: "#fff"
              }
            }
          },
          scales: {
            x: {
              ticks: {
                color: "rgba(255,255,255,1)",
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                color: "rgba(255,255,255,1)",
              },
            },
          },
        },
      });
    })
    .catch((err) => console.error(err));
}


let myBarChart = new Chart({
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
const monthSelect = document.querySelector("#months");
window.addEventListener("DOMContentLoaded", createPieChart);
