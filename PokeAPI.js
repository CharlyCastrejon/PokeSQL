async function fetchPokemonData(nombre){
    console.log("Buscando datos del Pokémon...");
    const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`)

    if (!respuesta.ok){
        throw new Error("Ocurrió un error, no se puedo recuperar la información del Pokémon.")
    }

    const datos = await respuesta.json();

    return {
        nombre: datos.name,
        tipo: datos.types.map(tipo => tipo.type.name).join(", "),
        peso: datos.weight / 10,
        altura: datos.height / 10
    };
}

module.exports = { fetchPokemonData }