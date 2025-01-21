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

  return(
    <div onClick={props.onClick} className="itemCard">
      <div style={{color:(color(props.patternIndex))}} className='itemName'>{props.name}</div>
      <div>
        <img draggable={false} className='crateImageItem' src={cratePath + crate.imagePathPatternCallback(props.patternIndex)}></img>
      </div>
      <div>
        Pattern : {props.patternIndex}
      </div>
    </div>
  )
}

export default CrateDisplay;