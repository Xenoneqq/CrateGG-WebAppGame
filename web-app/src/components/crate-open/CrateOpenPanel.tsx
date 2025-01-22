import './CrateOpenPanel.css'

function CrateOpenPanel(props){
  return(
  <>
  <div className="crateOpenWindow">
        <div className='panelSellOption'>
          Do you want to open the Crate?
        </div>
        <div>
        <img width={'150px'} style={{imageRendering:'pixelated', userSelect:'none'}} draggable={false} src={(props.crateImage)}></img>
        </div>
        <div className='panelSellOption'>
          <button onClick={props.openOrder} className='sellPanelButton'>Open Crate</button>
          <button onClick={props.back} className='sellPanelButton'>No</button>
        </div>
    </div>
  </>
  )
}

export default CrateOpenPanel;