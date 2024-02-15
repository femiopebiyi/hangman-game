import { useCallback, useEffect, useState } from "react"
import words from "./wordList.json"
import HangmanDrawing from "./HangmanDrawing"
import HangmanWord from "./HangmanWord"
import Keyboard from "./Keyboard"

function App() {
  const [wordToGuess, setGuessToGuess] = useState(()=> {
    let random = Math.floor(Math.random()* words.length)

    const word = words[random]
    return word
  })

const [guessedLetter, setGuessedLetter] = useState<string[]>([])

const inCorrectLetters = guessedLetter.filter(letter => !wordToGuess.includes(letter))

const isLoser =  inCorrectLetters.length >= 6
const isWinner = wordToGuess.split("").every(letter => guessedLetter.includes(letter))

const addGuessedLetter = useCallback((letter: string)=>{
 if(guessedLetter.includes(letter) || isLoser || isWinner) return

  setGuessedLetter(currentLetters => [...currentLetters, letter])
},[guessedLetter, isWinner, isLoser])



useEffect(()=>{
  const handler = (e: KeyboardEvent)=>{
    const key = e.key

    if(!key.match(/^[a-z]$/)) return

    e.preventDefault()

    addGuessedLetter(key)
  }

  document.addEventListener("keypress", handler)

  return()=>{
    document.removeEventListener("keypress", handler)
  }
},[guessedLetter])

  return (
    <div style={{
      maxWidth: '800px',
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
      margin: "0 auto" ,
      alignItems: "center"
    }}>
      <div style={{fontSize: "2rem", textAlign:"center"}}>
        {isWinner && "Winner - refresh"}
        {!isWinner && "Loser - refresh"}
      </div>
      <HangmanDrawing numberOfGuesses={inCorrectLetters.length}/>
      <HangmanWord guessedLetters = {guessedLetter} wordToGuess={wordToGuess} reveal ={isLoser}/>
      <div style={{alignSelf: "stretch"}}>
    <Keyboard activeLetter = {guessedLetter.filter(letter=> wordToGuess.includes(letter))} inactiveLetters={inCorrectLetters}
    addGuessedLetter ={addGuessedLetter} disabled={isWinner || isLoser}/>
      </div>
      
    </div>
  )
}

export default App
