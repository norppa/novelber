import { useEffect, useState } from "react"
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTheme } from "victory"
import { MdSave, MdSaveAs } from "react-icons/md"
import { IoSettingsOutline } from "react-icons/io5"


import "./App.css"
import DayPicker from "./DayPicker"

const KEY = "@Novelber/data"

const isInteger = (str) => str.split("").every(c => Number.isInteger(Number(c)))

const days = new Array(31).fill(null).map((_, i) => i)
const today = new Date("2024-11-01")


export default function App() {
  const [words, setWords] = useState(0)
  const [date, setDate] = useState(today)
  const [data, setData] = useState([0])
  const [showSettings, setShowSettings] = useState(false)
  const [confirmClearData, setConfirmClearData] = useState(false)

  useEffect(() => {
    const storageData = localStorage.getItem(KEY)
    console.log(storageData)
    if (storageData !== null) {
      const data = JSON.parse(storageData)
      setData(data)
      setWords(data[data.length - 1])
    }
  }, [])

  const onWordsChange = (event) => {
    const value = event.target.value
    if (isInteger(value)) setWords(value)
  }

  const onWordsFocus = (event) => {
    event.target.select()
  }

  const submitOnEnter = (event) => {
    if (event.key === "Enter") submit()
  }

  const submit = () => {
    const newData = [...data]
    newData[date.getDate()] = Number(words) // OVERRIDES
    localStorage.setItem(KEY, JSON.stringify(newData))
    setData(newData)
  }

  const SaveIcon = data[date.getDate()] ? MdSaveAs : MdSave

  let maxWordsPerDay = 0
  let maxWordsDay = undefined
  for (let i = 1; i < data.length; i++) {
    const wordsPerDay = data[i] - data[i - 1]
    console.log("W", wordsPerDay)
    if (wordsPerDay > maxWordsPerDay) {
      maxWordsPerDay = wordsPerDay
      maxWordsDay = i
    }
  }

  const clearData = () => {
    if (confirmClearData) {
      localStorage.removeItem(KEY)
      setData([0])
      setWords(0)
      setDate(today)
    } else {
      setConfirmClearData(true)
      setTimeout(() => setConfirmClearData(false), 3000)
    }
  }

  return (
    <div className="App">
      <div className="H1Box">
        <h1>Novelber</h1>
      </div>



      <div className="InputBox">
        <div className="WordCountInput">
          Word Count:
          <input value={words} onChange={onWordsChange} onKeyDown={submitOnEnter} onFocus={onWordsFocus} />
        </div>
        <DayPicker date={date} setDate={setDate} />
        <button onClick={submit} id="SaveBtn"><SaveIcon /></button>
      </div>



      <div className="Main">

        {maxWordsDay &&
          <div className="StatsContainer">
            {showSettings
              ? null
              : <div className="Stats">
                Average Words per Day: {data[data.length - 1] / (data.length - 1)}
                <br />
                Maximum Words per Day: {maxWordsPerDay} ({maxWordsDay}/11)
              </div>}
            <IoSettingsOutline className="SettingsIcon" onClick={() => setShowSettings(!showSettings)} />
          </div>
        }

        {showSettings
          ? <div>
            <h2>Privacy</h2>
            <p>Novelber stores your data only on your browser. No data is sent anywhere else. This also means you can only use your stored data from the same browser you used to enter it, so you can not use for example a mobile device on some days and a desktop device on others.</p>
            <p>You can clear all the stored data from the button below.</p>

            {confirmClearData
              ? <button className="confirm">Confirm deletion of all user data</button>
              : <button onClick={clearData}>Clear all user data</button>
            }
          </div>
          :
          <VictoryChart theme={VictoryTheme.material} domain={{ words: [100] }} width={800} height={450}>
            <VictoryAxis tickValues={days} tickFormat={x => x === 0 ? "" : `  ${x}  `} />
            <VictoryAxis dependentAxis />
            <VictoryLine data={[{ day: 0, words: 0 }, { day: 30, words: 50000 }]} x="day" y="words" />

            <VictoryLine data={data.map((point, i) => ({ day: i, words: point }))} x="day" y="words" />
          </VictoryChart>
        }
      </div>
      <div className="space" />
    </div>
  )
}