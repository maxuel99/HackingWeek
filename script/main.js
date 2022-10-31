async function requestAPI() {
    const response = await fetch('https://api.spaceflightnewsapi.net/v3/articles')
    const data = await response.json();

    data.forEach ((e, index) => {
        const image = document.querySelector(`tbody tr:nth-child(${index+1}) .tdImg`)
        
        const img = document.createElement('img')
        const p = document.createElement('p')
        p.setAttribute('class', 'p-url-img')
        p.innerHTML = e.imageUrl
        img.setAttribute('src', e.imageUrl)
        img.setAttribute("class", "img-fluid")
        img.setAttribute('width', '150px')
        img.setAttribute('height', '150px')
        image.append(img)
        p.style.display = 'none'
        image.append(p)
        
        const title = document.querySelector(`tbody tr:nth-child(${index+1}) .tdTitle`)
        title.append(e.title)

        const link = document.querySelector(`tbody tr:nth-child(${index+1}) .tdUrl`)
        const url = document.createElement('a')
        url.setAttribute('href', e.url)
        url.setAttribute('target', '_blank')
        url.innerHTML = e.url
        tableUrl.appendChild(url)
        link.append(url)

        const dataPubl = document.querySelector(`tbody tr:nth-child(${index+1}) .tdDate`)
        dataPubl.append(e.publishedAt)

        const newSite = document.querySelector(`select option:nth-child(${index+2})`)
        newSite.setAttribute('value', e.newsSite)
        newSite.append(e.newsSite)

        const trEl = document.querySelector(`#tbody-filter tr:nth-child(${index+1}`)
        console.log(trEl)
        trEl.dataset.publisher = e.newsSite

    })

    function removeduplicate() {
        var mycode = {};
        $("select[id='select-filter'] > option").each(function () {
            if (mycode[this.text]) {
                $(this).remove();
            } else {
                mycode[this.text] = this.value;
            }
        });
    }

    removeduplicate();

}

requestAPI();

// document.addEventListener('DOMContentLoaded', function () {
//     const calendarEl = document.getElementById('calendar');
//     const calendar = new FullCalendar.Calendar(calendarEl, {
//         initialView: 'dayGridMonth'
//     });
//     const calendario = document.querySelector('.calendario_svg')
//     calendario.addEventListener('click', () => {
//     table.style.display = 'none'
//     grafico.style.display = 'none'
//     btnFilter.style.display = 'none'
//     btnCSV.style.display = 'none'
//     calendarEl.style.display = 'flex'
//     calendar.render();
//   })
// });
// const calendario = document.querySelector(".calendario_svg")
const articoli = document.querySelector(".articoli_svg")
const Statistiche = document.querySelector(".statistiche_svg")
const table = document.querySelector('.table')
const calendarEl = document.getElementById('calendar')

const btnFilter = document.querySelector('.form-select')
const btnCSV = document.querySelector('.button-CSV')

btnFilter.style.display = 'none'
btnCSV.style.display = 'none'
table.style.display = 'none'



tableImage = document.querySelector('.tdImg')
tableTitle = document.querySelector('.tdTitle')
tableUrl = document.querySelector('.tdUrl')
tableData = document.querySelector('.tdDate')

const image = document.createElement('img')
const title = document.createElement('p')
const url = document.createElement('a')
const datArt = document.createElement('p')


articoli.addEventListener('click', () => {
    if (table.style.display = 'none') {
        image.style.display = 'flex'
        table.style.display = 'flex'
        btnFilter.style.display = 'flex'
        btnCSV.style.display = 'flex'
        calendarEl.style.display = 'none'
        grafico.style.display = 'none'
    } else if (table.style.display = 'flex') {
        table.style.display = 'none'
    }
})

function htmlToCSV(html, filename) {
	var data = [];
	var rows = document.querySelectorAll("table tr");
			
	for (var i = 0; i < rows.length; i++) {
		var row = [], cols = rows[i].querySelectorAll(".p-url-img, td, th");

        
				
	for (var j = 0; j < cols.length; j++) {
		        row.push(cols[j].innerText);
        }
		        
		data.push(row.join(",")); 		
	}

	downloadCSVFile(data.join("\n"), filename);
}

function downloadCSVFile(csv, filename) {
	var csv_file, download_link;

	csv_file = new Blob([csv], {type: "text/csv"});

	download_link = document.createElement("a");

	download_link.download = filename;

	download_link.href = window.URL.createObjectURL(csv_file);

	download_link.style.display = "none";

	document.body.appendChild(download_link);

	download_link.click();
}

document.querySelector(".button-CSV").addEventListener("click", function () {
	var html = document.querySelector("table").outerHTML;
	htmlToCSV(html, "table.csv");
})



const select = document.getElementById('select-filter')
select.addEventListener('change', (e) => {
e.target.value;
console.log(e.target.value)
const trList = document.querySelectorAll(`#table > tbody tr`)
trList.forEach((element) => {
    console.log("foreach",element.dataset, e.target.value)
    if (element.dataset.publisher == e.target.value) {
        element.style.display = 'flex'
    } else {
        element.style.display = 'none'
    }
    })
})


// Grafico script
Statistiche.onclick = function() {
    grafico.style.display = "flex"
    table.style.display = 'none'
    btnFilter.style.display = 'none'
    btnCSV.style.display = 'none'
    calendarEl.style.display = 'none'
    }
const grafico = document.querySelector(".div-gigante")
grafico.style.display = 'none'
