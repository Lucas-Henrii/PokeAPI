let offset = 0;
let isSearch = false;

async function getPokemon() {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${offset}`
    );
    const data = await response.json();

    const ul = document.querySelector(".ul_list");
    ul.innerHTML = "";

    await Promise.all(
      data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        const details = await res.json();

        const li = document.createElement("li");
        li.classList.add("li_poke");
        li.innerHTML = `
        <img class="img_poke" src="${details.sprites.front_default}" alt="${details.name}">
                <h3>${details.name}</h3>        
            `;

        ul.appendChild(li);

        setTimeout(() => {
          li.classList.add("show");
        }, 50);
      })
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

const ul = document.querySelector(".ul_list");

document.querySelector(".btn_next").addEventListener("click", () => {
  if (!isSearch) {
    offset += 10;
    getPokemon();
  }
});

document.querySelector(".btn_prev").addEventListener("click", () => {
  if (!isSearch && offset > 0) {
    offset -= 10;
    getPokemon();
  }
});

getPokemon();

async function searchPoke(name) {
  try {
    isSearch = true;
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
    );
    if (!response.ok) throw new Error("Pokémon não encontrado");

    const details = await response.json();

    const ul = document.querySelector(".ul_list");
    ul.innerHTML = "";

    const li = document.createElement("li");

    li.classList.add("li_poke");
    li.innerHTML = `
    <img class="img_poke" src="${details.sprites.front_default}" alt="${details.name}">
      <h3>${details.name}</h3>
    `;

    ul.appendChild(li);

    document.querySelector(".input_search").value = "";

    setTimeout(() => {
      li.classList.add("show");
    }, 50);
  } catch (error) {
    console.log(error);
    alert("Pokémon não encontrado verifique o nome.");
  }
}

document.querySelector(".btn_search").addEventListener("click", () => {
  const input = document.querySelector(".input_search").value;
  if (input.trim() !== "") {
    searchPoke(input);
  } else {
    isSearch = false;
    getPokemon();
  }
});

document.querySelector(".input_search").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const input = e.target.value;
    if (input.trim() !== "") {
      searchPoke(input);
    } else {
      isSearch = false;
      getPokemon();
    }
  }
});
