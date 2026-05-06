async function fetchData() {
  const response = await fetch("./converted-data.json");

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.status}`);
  }
  
  return await response.json()
}

// used Copilot to assist with the development and integration of elements of initList

function initList(data, count = null) {
  const container = document.getElementById("list-container");

  if (count !== null) {
      data = data.slice(0, count); // subset data
  };

  const options = {
    valueNames: ["Title", "Author", "Translator", "Language", "Link"],
    item: `
      <div class="flex-item">
        <h3 class="Title"></h3>
        <p class="Author"></p>
        <p class="Translator"></p>
        <a class="Link" target="_blank"></a>
      </div>
    `
  };

  const list = new List(container, options, data);

  list.items.forEach((item, index) => {
    const row = data[index];
    const keys = Object.keys(row);

    const title = row[keys[0]];
    const author = row[keys[1]];
    const translator = row[keys[2]];
    const lng = row[keys[3]];
    const source = row[keys[4]];
    const isLink = typeof source === "string" && source.startsWith("http");

    let color = "white";
      if (lng === "Tamil") {
        color = "#A4CCCC";
        }
        else if (lng === "Bengali") {
          color = "#CFB4CC";
          } else if (lng === "Hindi / Urdu") {
              color = "#C0B6AF";
      };  

    const element = item.elm;
    element.style.backgroundColor = color;

    element.querySelector(".Title").innerHTML =
      isLink ? `<a href="${source}" target="_blank">${title}</a>` : title;

    element.querySelector(".Author").textContent = `Author: ${author}`;
    element.querySelector(".Translator").textContent = `Translator: ${translator}`;

    const link = element.querySelector(".Link");
    if (isLink) {
      link.remove(); 
    } 
  });
}

function sortAlphabetically(data) {
  return data.sort((a, b) => {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    const valA = a[keysA[1]].toString().toLowerCase();
    const valB = b[keysB[1]].toString().toLowerCase();
    return valA.localeCompare(valB);
  });
}

function shuffle(data) {
  for (let i = data.length - 1; i > 0; i--) {  // i starts at length of data - 1; while i > 0, reducing i by 1
    const j = Math.floor(Math.random() * (i + 1)); // random number between 1 and number of data points, round down to nearest integer
    [data[i], data[j]] = [data[j], data[i]];
  };
  return(data);
}

async function initShufflePage() {
  const data = await fetchData();
  const shuffled = shuffle(data);
  initList(shuffled, 8);
}

async function initSortedPage() {
  const data = await fetchData();
  const sorted = sortAlphabetically(data);
  initList(sorted);
}

document.addEventListener("DOMContentLoaded", () => { 
  if (document.body.id === "full-collection") {
      initSortedPage();
      }
      else if (document.body.id === "subset-collection") {
        initShufflePage();
        }
});    

