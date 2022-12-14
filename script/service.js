//Questo script servir√† a prelevare i dati fornendo anche la possibilit√† di utilizzare il parametro passato per eventuali filtri o altre funzionalit√†

const API_URL="https://api.spaceflightnewsapi.net/v3/";

async function fetchApiData(suffix = "") {
  console.log(suffix)
  const [apiData, error] = await fetch(`${API_URL}${suffix}`)
    .then((r) => [r, null])
    .catch((err) => [null, err]);

  if (apiData.ok) {
    const processedApiData = await apiData.json();
    return processedApiData;
  } else {
    throw error;
  }
}
