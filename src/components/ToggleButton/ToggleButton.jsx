const ToggleButton = ({ className = "", state, offJSX = "Off", onJSX = "On" }) => {
  return (
    <button className={`toggle-button ${className}`} onClick={() => {
      state[1](!state[0])
    }}>
      {state[0] && onJSX}
      {!state[0] && offJSX}
    </button>
  );
}
 
export default ToggleButton;