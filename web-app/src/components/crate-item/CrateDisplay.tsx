import getCrate from '../../assets/crates/crateData';
import './CrateDisplay.css'

const cratePath = '/crates'

function CrateDisplay(props){
  const crate = getCrate(props.crateAssetID)
  
  const color = (rarity) => {
    switch(rarity){
      case "common":{
        return 'white';
      }
      case "rare":{
        return 'cyan';
      }
      case "legendary":{
        return 'red';
      }
      default:{
        return 'white';
      }
    }
  }

  const onMarketMessage = () => {
    if(props.crateMarkets == null || props.crateMarkets.length == 0) return(<></>);
    return(
      <>
      <div style={{
        position:'absolute', transform:'rotate(20deg)',
        fontWeight:800,
        fontSize:'20px',
        color:'orange',
        opacity:0.66,
        }}>
        ON MARKET
      </div>
      </>
    )
  }

  return(
    <div
     onClick={props.onClick} className="itemCardStorage"
     style={
      props.crateMarkets != null && props.crateMarkets.length != 0 ? { border: '2px solid orange' } : {}}
     >
      <div style={{color:(color(props.patternIndex))}} className='itemName'>{props.name}</div>
      <div>
        <img draggable={false} className='crateImageItem' src={cratePath + crate.imagePathPatternCallback(props.patternIndex)}></img>
      </div>
      <div>
        Pattern : {props.patternIndex}
      </div>
      {onMarketMessage()}
    </div>
  )
}

export default CrateDisplay;