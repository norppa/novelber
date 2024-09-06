import { forwardRef } from "react"
import DatePicker from "react-datepicker"

import "react-datepicker/dist/react-datepicker.css"

const today = new Date("2024-11-01")

const DayPickerInput = forwardRef(({ value, onClick, className }, ref) => {
  const output = today.getDate() == value.split("/")[0] ? "Today" : value
  return <button className={className} onClick={onClick} ref={ref}>
    {output}
  </button>
})

DayPickerInput.displayName = "DayPicker"

const excludeDates = [
  new Date("2024-10-28"),
  new Date("2024-10-29"),
  new Date("2024-10-30"),
  new Date("2024-10-31"),
  new Date("2024-12-01"),
]

export default function DayPicker({date, setDate}) {

  return <DatePicker
    dateFormat={"dd/MM"}
    renderCustomHeader={() => <b>Novelber 2024</b>}
    excludeDates={excludeDates}
    highlightDates={[today]}
    selected={date}
    onChange={date => setDate(date)}
    calendarStartDay={1}
    customInput={<DayPickerInput className="DayPickerInput" />} />
} 