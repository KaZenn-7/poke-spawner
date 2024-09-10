document.addEventListener("DOMContentLoaded", () => {
  // Seleciona o botão pelo ID e adiciona um listener de clique
  const spawnButton = document.getElementById("spawn");
  spawnButton.addEventListener("click", spawnPokemon);
});

function toCapitalize(str) {
  firstLetter = str[0].toUpperCase();
  newStr = firstLetter;
  for (i = 1; i < str.length; i++) {
    newStr += str[i];
  }
  return newStr;
}

async function getByGeneration(generation) {
  try {

    let pokemonName;
    let pokemonRate;

    let spawn = Math.floor(Math.random() * 255);
    console.log(`Random Spawn Rate: ${spawn.toFixed(2)}\n`);

    do {

      let response = await axios.get(`https://pokeapi.co/api/v2/generation/${generation}`);
      let random = Math.floor(Math.random() * response.data.pokemon_species.length);

      pokemonName = response.data.pokemon_species[random].name;

      response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);

      let pokemon_species = response.data;
      pokemonRate = pokemon_species.capture_rate;

      console.log(`Pokemon Capture Rate: ${pokemonRate.toFixed(2)}`);
      console.log(`Trying to spawn a ${pokemonName}...\n`);
      console.log(`${(pokemonRate > spawn)? "": `Wild ${pokemonName} spawnned!\n`}`)

    } 
    while (pokemonRate != 190);

    response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    let pokemon = response.data;

    pokemonName = toCapitalize(pokemonName);

    let types = [];
    pokemon.types.forEach((obj) => {
      types.push(obj.type.name);
    });

    let object = {
      name: pokemonName,
      altura: `${(pokemon.height / 10).toFixed(2)}m`,
      peso: `${pokemon.weight.toFixed(2)}kg`,
      tipos: types.join(", "),
      taxa: pokemonRate,
      image: pokemon.sprites.front_default,
    }

    return object;

  } catch (e) {
    console.error(e);
  }
}

async function spawnPokemon() {
  try {
    
    let { name, altura, peso, tipos, taxa, image } = await getByGeneration(1);

    const display = document.getElementById("pokemonDisplay");
    const wild = document.getElementById("wild");

    wild.innerHTML = `A wild ${name} has appeared!`;

    display.innerHTML = `
              <p>Nome: ${name}</p>
            <p>Altura:  ${altura}m</p>
            <p>Peso: ${peso}kg</p>
            <p>Tipos: ${tipos}</p>
            <p>Taxa de Captura: ${taxa}</p>
            <img src="${image}" alt="${name}">
            `;
  } catch (error) {
    const display = document.getElementById("pokemonDisplay");
    display.innerHTML = `<p>Erro ao buscar Pokémon. Tente novamente.</p>
      <p>${error}</p>`;
  }
}
