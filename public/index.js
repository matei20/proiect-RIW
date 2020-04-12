const searchInput = document.getElementById("searchInput");
const buttonSearch = document.getElementById("buttonSearch");
const resultsSection = document.getElementById("resultsSection")

buttonSearch.onclick = async () => {
    resultsSection.innerHTML = "";
    const url = `/search/${encodeURIComponent(searchInput.value)}`;
    const result = await fetch(url).then((r) => r.json());
    console.log(result);
    result.forEach(t => {
        resultsSection.innerHTML += `<p>${t.term}:</p> `;

        t.docs.forEach((d) => {
            resultsSection.innerHTML += `<div><a href = "static/${d.d}">${d.d}</a></div> `;
        });
    });
    //console.log(result); //debugging

};