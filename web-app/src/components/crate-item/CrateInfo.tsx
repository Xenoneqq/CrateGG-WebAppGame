import './CrateInfo.css'

function CrateInfo(props){
  return(
    <>
    <div className="crateInfoPanelTwo">
      <div className='name'>NameHere</div>
      <div style={{display: 'flex', flexDirection:'row', gap:'15px', flexWrap:'wrap', justifyContent:'center', alignItems:'center'}}>
        <div className='panelCard' style={{justifyContent:'center', alignItems:'center'}}>
          Image Here
        </div>
        <div style={{width:'300px'}} className='panelCard'>
          <div>
            Rarity : <b>rare</b> <br/>
            Pattern index : <b>999</b> <br/>
            Crate type ID : <b>999</b>
          </div>
        </div>
      </div>
        <div className="bottomNav">
          <button onClick={props.cancle} className='cancel'>
            Close
          </button>
          <button className='purchase'>
            Sell
          </button>
        </div>
      </div>
    </>
  )
}

export default CrateInfo;