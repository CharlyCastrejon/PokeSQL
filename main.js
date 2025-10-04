const { PokemonDAO } = require('./PokemonDAO');
const { fetchPokemonData } = require('./PokeAPI');
const { closePool } = require('./db')
const readline = require('readline-sync');

const pokemonDAO = new PokemonDAO();

// Operaciones CRUD (que llaman al DAO)

async function handleGetAndSavePokemon(){
    const nombre = readline.question("\nIngrese el nombre del Pokémon a buscar: ");

    try {
        const apiData = await fetchPokemonData(nombre.toLowerCase());

        console.log("------ Datos Encontrados -------");
        console.log(`Nombre: ${apiData.nombre} | Tipo: ${apiData.tipo} | Peso: ${apiData.peso} kg | Altura: ${apiData.altura} m`);
        console.log("--------------------------------");

        const save = readline.question("¿Quiéres guardar este Pokémon en la base de datos? (s/n)");

        if (save.toLowerCase() === 's'){
            const resultado = await pokemonDAO.insert(apiData);
            console.log(`El Pokémon ${resultado.nombre} ha sido guardado con éxito.`)
        } else {
            console.log("Se ha cancelado el guardado.")
        }
    } catch (error){
        console.error(`Error: ${error.message}`)
    }
}

async function handleListPokemon() {
    try {
        const pokemons = await pokemonDAO.findAll();
        console.log("----- Pokemons Guardados (READ) -----");
        if (pokemons.length === 0){
            console.log("No hay Pokémons registrados.")
            return;
        }
        pokemons.forEach((p, index) => {
            console.log(`${index + 1}. [ID: ${p.id}] Nombre: ${p.nombre} | Tipo(s): ${p.tipo} | Peso: ${p.peso} kg | Altura ${p.altura} m`)
        })
        console.log("-------------------------------------")
    } catch (error){
        console.error(`Error al listar Pokémons: ${error.message}`)
    }
}

async function handleUpdatePokemon(){
    const nombre = readline.question("Ingrese el Pokémon a actualizar: ")
    try {
        const pokemon = await pokemonDAO.findByName(nombre);
        if (!pokemon) {
            console.log(`El Pokémon con nombre ${nombre} no se ha encontrado en la base de datos`);
            return;
        }
            console.log(`Datos Actuales: [ID: ${pokemon.id}] Nombre: ${pokemon.nombre} | Tipo(s): ${pokemon.tipo} | Peso: ${pokemon.peso} kg | Altura ${pokemon.altura} m`)
            const nuevoTipo = readline.question("Ingrese el nuevo tipo para este Pokémon: ");

            const resultado = await pokemonDAO.update(pokemon.id, {tipo: nuevoTipo});

            if (resultado){
                console.log("El Pokémon ha sido actualizado correctamente.")
            } else {
                console.log("No se puedo actualizar el Pokémon (Revise que el ID exista)");
            }
    } catch (error){
        console.error("Error al actualizar: ", error.message);
    }
}

async function handleDeletePokemon() {
    const id = readline.question("Ingrese el ID del Pokémon a eliminar: ")

    try{
        const resultado = await pokemonDAO.delete(id);

        if (resultado){
            console.log("Se ha eliminado el Pokémon correctamente.")
        } else {
            console.log("No se ha encontrado un Pokémon con ese ID.")
        }
    } catch(error){
        console.error("Error al eliminar. Asegurese que el ID exista.", error.message)
    } 
}

async function mainMenu() {
    let ejecutando = true;
    while (ejecutando) {
        console.log("---------------------")
        console.log("     POKÉMON CRUD    ")
        console.log("---------------------")
        console.log("1. Buscar Pokemon en la API y Guardar (CREATE)");
        console.log("2. Listar Pokemons guardados (READ)");
        console.log("3. Actualizar el tipo de Pokémon por Nombre (UPDATE)");
        console.log("4. Eliminar Pokémon por ID (DELETE)");
        console.log("5. Salir");
        console.log("---------------------")

        const opcion = readline.question("Seleccione una opción: ");

        switch(opcion) {
            case '1': await handleGetAndSavePokemon(); break;
            case '2': await handleListPokemon(); break;
            case '3': await handleUpdatePokemon(); break;
            case '4': await handleDeletePokemon(); break;
            case '5': 
                console.log("Saliendo del progama...");
                ejecutando = false;
                break;
            default: console.log("Opción inválida.")
        }
    }
}

async function startApp() {
    try {
        await mainMenu();
    } catch (error) {
        console.error("Ocurrió un error fatal: ", error.message);
    } finally {
        await closePool();
    }
    
}

startApp();