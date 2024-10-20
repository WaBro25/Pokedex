import React, { useEffect, useState } from 'react'
import { getFullPokedexNumber, getPokedexNumber } from '../utils'
import TypeCard from './TypeCard'
import Modal from './Modal'

function Pokecard(props) {
  const { selectedPokemon } = props
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [skill, setSkill] = useState(null)
  const [loadingSkill, setLoadingSkill] = useState(false)


  //deconstruct all the values from pokemon data api
  const { base_experience, game_indices, weight, name, height, abilities, stats, types, moves, sprites
  } = 
  data || {}
  console.log("data", data)

    const imgList = Object.keys(sprites || {}).filter(val => {
      if (!sprites[val]) { return false }
      if (['versions', 'other'].includes(val)) { return false }
      return true
  })

  async function fetchMoveData(move, moveUrl) {
    if (loadingSkill || !localStorage || !moveUrl) { return }

    // check cache for move
    let c = {}
    if (localStorage.getItem('pokemon-moves')) {
        c = JSON.parse(localStorage.getItem('pokemon-moves'))
    }

    if (move in c) {
        setSkill(c[move])
        console.log('Found move in cache')
        return
    }

    try {
      setLoadingSkill(true)
        const res = await fetch(moveUrl)
        const moveData = await res.json()
        console.log('Fetched move from API', moveData)

        const description = moveData?.flavor_text_entries.filter(val => {
            return val.version_group.name = 'firered-leafgreen'
        })[0]?.flavor_text

        const skillData = {
            name: move,
            description
        }
        console.log('skillData', skillData)
        setSkill(skillData)
        c[move] = skillData
        localStorage.setItem('pokemon-moves', JSON.stringify(c))
    } catch (err) {
        console.log(err)
    } finally {
        setLoadingSkill(false)
    }
}

  useEffect(() => {

    //this uses a useEffect for the api call
    //loading state
    //if loading exit logic

    if (loading || !localStorage) 
    {
      return
    } 


    //1. define the cache 
    //check if selectedpokemon info is available in cache
    let cache = {}

    if(localStorage.getItem('pokedex')){
      cache = JSON.parse(localStorage.getItem('pokedex'))
    }

    if(selectedPokemon in cache){
        setData(cache[selectedPokemon])
        console.log('found pokemon in cache')
        return 
    }

    async function fetchPokemonData() {

      try {
          setLoading(true)
          const baseUrl = 'https://pokeapi.co/api/v2/'
          const suffix = 'pokemon/' + getPokedexNumber(selectedPokemon)
          const finalUrl = baseUrl + suffix

          const res = await fetch(finalUrl)
          const pokemonData = await res.json()

          const pokemonForms = pokemonData?.form

          console.log("form" , pokemonForms)
          console.log("here is pokemon data=>>>>>>", pokemonData)

          //this is were we set the data hook value to pokemon data
          setData(pokemonData)

          console.log('pokemonData', pokemonData)
          cache[selectedPokemon] = pokemonData
          localStorage.setItem('pokedex', JSON.stringify(cache))
      } catch (err) {
          console.log(err.message)
      } finally {
          setLoading(false)
      }
  }

  fetchPokemonData()

  // if we fetch from the api, make sure to save the information to the cache for next time
}, [selectedPokemon])


if(loading || !data) {return <div><h4>loading...</h4></div>}

  return (
    <div className='poke-card'>
  
        {skill && (<Modal handleCloseModal={() => {setSkill(null)}}>
            <div>
              <h6>Name</h6>
                <h2 className='skill-name'>{skill.name.replaceAll('-', ' ')}</h2>
            </div>
            <div>
              <h6>Description</h6>
                <p>{skill.description}</p>
            </div>
        </Modal>)}
  
    <div >
        <h4>
          #{getFullPokedexNumber(selectedPokemon)}
        </h4>
        <h2>
          {name}
          </h2>      
        </div>
        <div className='type-container'>
          {types.map((typeObj, typeIndex) => {
            //to access a multi layerd object. call the variable typeObj as it is
            //and object then it maps over the object of the api
            //then it goes typeObj(the map) and it checks type
            //then it grabs name
            return (<TypeCard key={typeIndex} type={typeObj?.type?.name}/>
            )
          })}
        </div>
        <div className='img-container'>
                {imgList.map((spriteUrl, spriteIndex) => {
                    const imgUrl = sprites[spriteUrl]
                    return (
                        <img key={spriteIndex} src={imgUrl} alt={`${name}-img-${spriteUrl}`} />
                    )
                })} 
            </div>  
              <h3>Stats</h3>
              <div className='stats-card'>
                {stats.map((statObj, statIndex) => {
                    const { stat, base_stat } = statObj
                    return (
                        <div key={statIndex} className='stat-item'>
                            <p>{stat?.name.replaceAll('-', ' ')}</p>
                            <h4>{base_stat}</h4>
                        </div>
                    )
                })}
            </div>
            <h3>Height</h3>
            <div className='pokemon-move-grid'>
            {height + " cms"}
            </div>
            <h3>Weight</h3>
            <div className='pokemon-move-grid'>
            {weight + " lbs"}
            </div>
            <h3>Exp</h3>
            <div className='pokemon-move-grid'>
            {base_experience}
            </div>
            <h3>Abilities</h3>
            <div className='pokemon-move-grid'>
              {abilities.map((abilityObj, abilityIndex) => {
                return( 
                <div key={abilityIndex}> 
                  {abilityObj?.ability?.name}
                </div>
                )
              })}
            </div>
            <h3>Found in games</h3>
            <div className='pokemon-move-grid'>
              {game_indices.map((game_indicesObj, game_indicesIndex) => {
                return( 
                <div key={game_indicesIndex}> 
                  {game_indicesObj?.version?.name}
                </div>
                )
              })}
            </div>
            <h3>Moves</h3>
            <div className='pokemon-move-grid'>
            {moves?.map((moveObj, moveIndex) => {
                    return (
                        <button className='button-card pokemon-move' key={moveIndex} 
                        onClick={() => {
                            fetchMoveData(moveObj?.move?.name, moveObj?.move?.url)
                        }}>
                            <p>{moveObj?.move?.name.replaceAll('-', ' ')}</p>
                        </button>
                    )
                })}
            </div>
    </div>
  )
}

export default Pokecard