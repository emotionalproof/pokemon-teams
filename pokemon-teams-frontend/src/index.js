const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`


// When a user loads the page, they should see all trainers, with their current team of Pokemon.
// Whenever a user hits Add Pokemon and they have space on their team, they should get a new Pokemon.
// Whenever a user hits Release Pokemon on a specific Pokemon team, that specific Pokemon should be released from the team.

document.addEventListener('DOMContentLoaded', e => {
    getTrainers(TRAINERS_URL)
    clickHandler()


})


const getTrainers = url => {
    return fetch(url)
    .then(resp => resp.json())
    .then(trainerObjs => {
        renderTrainers(trainerObjs)
    })
    .catch(error => {
        console.log(error.message);
    })
}

const renderTrainers = trainers => {
    trainers.forEach(trainer => {
        const div = createTrainerDiv(trainer)
        renderTrainerDiv(div)
    })
}

const createTrainerDiv = trainer => {
    const div = document.createElement("div")
    div.className = "card"
    div.dataset.id = trainer.id
    div.id = trainer.id
    div.innerHTML = `
        <p>${trainer.name}</p>
        <button data-trainer-id="${trainer.id}">Add Pokemon</button>
        <ul>
            ${renderPokemons(trainer.pokemons)}
        </ul>
        </div>
                        `
    return div
}

const renderTrainerDiv = div => {
    const main = document.querySelector("main")
    main.append(div)
}

const renderPokemons = pokemons => {
    return pokemons.map(pokemon => {
        return `<li>${pokemon.nickname} (${pokemon.species})<button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`
    }).join("")
}

const clickHandler = () => {
    document.addEventListener("click", (e) => {
        if (e.target.textContent === "Add Pokemon") {
            const button = e.target
            const trainerId = button.dataset.trainerId
            const ul = button.nextElementSibling
            addPokemonToTrainer(trainerId, ul)
        } else if (e.target.textContent === "Release"){
            const button = e.target
            const id = button.dataset.pokemonId
            deletePokemon(id)
            
            
        }
    })
}

const addPokemonToTrainer = (trainerId, ul) => {
    return fetch(POKEMONS_URL, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "trainer_id": trainerId
        })
    })
    .then(resp => resp.json())
    .then(pokemonObj => {
        renderNewPokemon(pokemonObj, ul)
    })
    .catch(error => {
        console.log("you had a boo boo:", error.message);
        
    })

}

const renderNewPokemon = (pokemonObj, ul) => {
    
    const li = createPokemonLi(pokemonObj)
    ul.append(li)
}

const createPokemonLi = pokemonObj => {
    const li = document.createElement("li")
    
    li.innerHTML = `${pokemonObj.nickname} (${pokemonObj.species})<button class="release" data-pokemon-id="${pokemonObj.id}">Release</button>`
    return li
}

const deletePokemon = id => {
    fetch(`http://localhost:3000/pokemons/${id}`, {
        method: "DELETE"
    })
    .then(resp => {
       const li = document.querySelector(`[data-pokemon-id="${id}"]`).parentElement
        li.remove()
    })
}