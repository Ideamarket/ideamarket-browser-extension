import React from "react"
import './styles.scss'

export default function ToggleSwitch({ 
  handleChange,
  value,
  isOn,
}: {
  handleChange: (val: string) => void
  value: string
  isOn: boolean
}) {
  function onToggle() {
    handleChange(value)
  }
  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={isOn} onChange={onToggle} />
      <span className="switch" />
    </label>
  );
}
