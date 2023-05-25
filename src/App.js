import React from "react";
import './App.css'
import Die from "./Die";
import { v4 as uuidv4 } from 'uuid'
import Confetti from "react-confetti";

export default function App() {
  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [numOfRolls, setNumOfRolls] = React.useState(0)
  const [startTime, setStartTime] = React.useState(null)
  const [endTime, setEndTime] = React.useState(null)
  const [elapsedTime, setElapsedTime] = React.useState(null)
  const [leastNumOfRolls, setLeastNumOfRolls] = React.useState(localStorage.getItem('leastNumOfRolls' || Infinity))
  const [leastSeconds, setLeastSeconds] = React.useState(localStorage.getItem('leastSeconds' || Infinity))
  const [isFirstGame, setIsFirstGame] = React.useState(localStorage.getItem('isFirstGame') === 'true' || true)

  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if (allHeld && allSameValue) {
      setTenzies(true)
      setEndTime(Date.now())
    }
  }, [dice])

  React.useEffect(() => {
    if (startTime && !endTime) {
      const timer = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000)
      return () => {
        clearInterval(timer)
      }
    }
  }, [startTime, endTime])

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: uuidv4(),
    }
  }

  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie())
    }
    return newDice
  }

  function resetGame() {
    setTenzies(false)
    setDice(allNewDice())
    setEndTime(null)
    setStartTime(null)
    setNumOfRolls(0)
    setElapsedTime(0);

    if (isFirstGame) {
      setLeastNumOfRolls(numOfRolls)
      setLeastSeconds(elapsedTime)
      localStorage.setItem('leastNumOfRolls', numOfRolls)
      localStorage.setItem('leastSeconds', elapsedTime)
      localStorage.setItem('isFirstGame', 'false')
      setIsFirstGame(false)
    } else {
      if (numOfRolls < leastNumOfRolls) {
        setLeastNumOfRolls(numOfRolls)
        localStorage.setItem('leastNumOfRolls', numOfRolls)
      }

      if (elapsedTime < leastSeconds) {
        setLeastSeconds(elapsedTime)
        localStorage.setItem('leastSeconds', elapsedTime)
      }
    }
  }

  const diceElements = dice.map(die => (
    <Die value={die.value} key={die.id} isHeld={die.isHeld} holdDice={() => holdDice(die.id)} />
  ))

  function rollDice() {
    if (!startTime) {
      setStartTime(Date.now())
    }

    if (!tenzies) {
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ?
          die :
          generateNewDie()
      }))
      setNumOfRolls(prevNum => prevNum + 1)
    } else {
      resetGame();
    }
  }

  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ? { ...die, isHeld: !die.isHeld } : die
    }))
  }

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="die-container">
        {diceElements}
      </div>
      <button className="roll-dice" onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
      <p>Number of rolls: {numOfRolls}</p>
      <p>Elapsed time: {elapsedTime / 1000} seconds</p>
      <p>Highest score: {leastNumOfRolls} rolls, {leastSeconds / 1000} seconds</p>
    </main>
  )
};
