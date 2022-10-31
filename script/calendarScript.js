const LIMIT = 350;

document.addEventListener("DOMContentLoaded", () => {
  const calendar = createCalendar();
  const calendarEl = document.getElementById("calendar");
  const calendarSvg = document.querySelector(".calendario_svg");

  document
    .querySelector(".calendar_pop-up_container_cross")
    .addEventListener("click", (e) => {
      document
        .getElementById("calendar_pop-up")
        .classList.add("calendar_pop-up--hidden");
      document.getElementById("calendar_pop-up").style.left = "-100%";
      removeLoadingScreen();
      document.getElementById("loading-icon").style.display = "unset";
    });
  document
    .querySelector(".central_container_darken-bgc")
    .addEventListener("click", ()=>{
      removeLoadingScreen();
      document.getElementById("loading-icon").style.display = "unset";
    });
  calendar.render();
  calendarEl.style.display = "none";

  calendarSvg.addEventListener("click", () => {
    calendarEl.style.display = "flex";
    table.style.display = "none";
    document.querySelector(".form-select").style.display = "none";
    document.querySelector(".button-CSV").style.display = "none";
    document.querySelector(".div-gigante").style.display = "none";

    initMonth(calendar);

    document
      .querySelector(".fc-prev-button")
      .addEventListener("click", () => fetchMonth(calendar));
    document
      .querySelector(".fc-prevYear-button")
      .addEventListener("click", () => fetchMonth(calendar));
    document
      .querySelector(".fc-next-button")
      .addEventListener("click", () => fetchMonth(calendar));
    document
      .querySelector(".fc-nextYear-button")
      .addEventListener("click", () => fetchMonth(calendar));
    document
      .querySelector(".fc-today-button")
      .addEventListener("click", () => initMonth(calendar));
  });
});

//funzione per la creazione del calendar stesso con relativi parametri
//ritorna lo stesso calendar per poter utilizzare successivamente i suoi metodi

function createCalendar() {
  const calendarEl = document.getElementById("calendar");

  const calendar = new FullCalendar.Calendar(calendarEl, {
    dayMaxEventRows: true,
    views: {
      timeGrid: {
        dayMaxEventRows: 4,
      },
    },
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "prevYear,prev,next,nextYear today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    eventClick: function (info) {
      const popUp = document.getElementById("calendar_pop-up");

      //evento per il popup delle informazioni

      const eventObj = info.event;
      document.querySelector(".calendar_pop-up_container_image img").src = "";

      fetchApiData(`articles/${eventObj.id}`)
        .then((data) => {
          document.querySelector(".calendar_pop-up_container_title").innerText =
            data.title;
          document.querySelector(".calendar_pop-up_container_image img").src =
            data.imageUrl;
          document.querySelector(
            ".calendar_pop-up_container_summary"
          ).innerText = data.summary;
          document.querySelector(
            ".calendar_pop-up_container_publisher_news-site"
          ).innerText = data.newsSite;
          document.querySelector(
            ".calendar_pop-up_container_publisher_link"
          ).href = data.url;
          document.getElementById("loading-icon").style.display = "none";
          loadingScreen();
          popUp.style.left = "50%";
        })
        .catch((err) => console.error(err));
    },
    eventMouseEnter: function (info) {
      info.el.style.cursor = "pointer";
    },
  });
  return calendar;
}

// funzione che controlla la data e la rende consona per la chiamata HTTP
// per utilizzare determinati filtri, successivamente rimuove gli eventi presenti
// e li aggiorna con quelli del mese che si sta visualizzando

function fetchMonth(calend) {

  const today = calend.getDate();
  const day = twoDayDigit(today);
  const month = twoMonthDigit(today);
  const year = today.getFullYear();
  const fullDate = `${year}-${month}-${day}`;

  loadingScreen();
  fetchApiData(
    `articles?publishedAt_lt=${year}-${("0" + (parseInt(month) + 1)).slice(
      -2
    )}-01&publishedAt_gte=${fullDate}&_limit=${LIMIT}`
  )
    .then((data) => {

      data.forEach((element) => {
        const event = calend.getEventById(`${element.id}`);
        if (event) event.remove();
      });

      data.forEach((element) => {
        calend.addEvent({
          id: element.id,
          title: ` ${element.title}`,
          start: element.publishedAt,
          allDay: false,
          display: "list-item",
        });
      });

      removeLoadingScreen();
    })
    .catch((err) => console.error(err));
}


//coppia di funzioni per rendere a due cifre month e day
function twoMonthDigit(month) {
  return ("0" + (month.getMonth() + 1)).slice(-2);
}
function twoDayDigit(day) {
  return ("0" + day.getDate()).slice(-2);
}


// funzione per scurire tutto lo schermo, opacizzandolo e non rendendolo scrollabile
function loadingScreen() {
  document.querySelector(".central_container_darken-bgc").style.display =
    "flex";
  document.querySelector("body").classList.add("overflow--hidden");
}

// funzione per rimuover il bgc scuro su tutto lo schermo e rendendo la pagina di nuovo scrollabile
function removeLoadingScreen() {
  if (
    !document
      .getElementById("calendar_pop-up")
      .classList.contains("calendar_pop-up--hidden")
  ) {
    document
      .getElementById("calendar_pop-up")
      .classList.add("calendar_pop-up--hidden");
  }
  document.getElementById("calendar_pop-up").style.left = "-100%";
  document.querySelector(".central_container_darken-bgc").style.display =
    "none";
  document.querySelector("body").classList.remove("overflow--hidden");
}
//funzione per la risoluzione di bug con l'api nel richiamare inizialmente
//i valori in relazione alla data ricevuta

function initMonth(calend) {
  const today = calend.getDate();
  const month = twoMonthDigit(today);
  const year = today.getFullYear();

  loadingScreen();
  fetchApiData(`articles?publishedAt_gte=${year}-${month}-01&_limit=${LIMIT}`)
    .then((data) => {

      data.forEach((element) => {
        const event = calend.getEventById(`${element.id}`);
        if (event) event.remove();
      });

      data.forEach((element) => {
        calend.addEvent({
          id: element.id,
          title: ` ${element.title}`,
          start: element.publishedAt,
          allDay: false,
          display: "list-item",
        });
      });

      removeLoadingScreen();
    })
    .catch((err) => console.error(err));
}
