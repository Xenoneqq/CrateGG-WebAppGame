const cratePath = '/crates';
import './Crateorder.css'
import getCrate from '../../assets/crates/crateData'

function Crateorder(props){
  const crateDB = props.crate;
  const crate = getCrate(crateDB.crateAssetID);
  const user = props.user;
  const offer = props;
  
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
    <>
    <div onClick={props.onClick} className="crateOrder">
      <div className='crateName' style={{color: color(crateDB.rarity)}}>{crateDB.name}</div>
      <img className="crateImage" src={cratePath + crate.imagePathPatternCallback(crateDB.patternIndex)} draggable={false}></img>
      <div className='price'>{offer.price} CC</div>
    </div>
    </>
  )
}

export default Crateorder;