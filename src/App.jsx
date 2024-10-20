import { useState } from 'react'
// import { Header } from './components/Header'
import SideNav from './components/SideNav'
import Pokecard from './components/Pokecard'

function App() {

  const [selectedPokemon, setSelectedPokemon] = useState(0)

  return (
    <>
    <SideNav selectedPokemon={selectedPokemon} setSelectedPokemon={setSelectedPokemon}/>
    <Pokecard selectedPokemon={selectedPokemon}/>
    </> 
  )
}

export default App
