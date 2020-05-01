const searchInput = document.getElementById("searchInput");
const buttonSearch = document.getElementById("buttonSearch");
const resultsSection = document.getElementById("resultsSection")

buttonSearch.onclick = async () => {
    resultsSection.innerHTML = "";
    const url = `/search/${encodeURIComponent(searchInput.value)}`;
    const result = await fetch(url).then((r) => r.json());
    console.log(result);
    result.forEach(t => {
        resultsSection.innerHTML += `<p>
            <a href="static/${t.link}">${t.link}</a>
        </p>`;

    });
    //console.log(result); //debugging

};