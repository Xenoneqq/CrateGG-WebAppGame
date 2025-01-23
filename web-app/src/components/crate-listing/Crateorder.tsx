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
      case 0:{
        return 'white';
      }
      case 1:{
        return 'cyan';
      }
      case 2:{
        return 'red';
      }
      default:{
        return 'white';
      }
    }
  }

  const displayDiscardButton = () => {
    const userID = localStorage.getItem("userid");
    //console.log(role, userID)
    if(props.sellerID != userID) return (<></>);
    
    return(
      <>
      <div 
      className='yourListingInfo'
      >YOUR<br/>LISTING</div>
      </>
    )
  }

  return(
    <>
    <div onClick={props.onClick} className="crateOrder">
      <div className='crateName' style={{color: color(crateDB.rarity)}}>{crateDB.name}</div>
      <img className="crateImage" src={cratePath + crate.imagePathPatternCallback(crateDB.patternIndex)} draggable={false}></img>
      <div className='price'>{offer.price} CC</div>
      {displayDiscardButton()}
    </div>
    </>
  )
}

export default Crateorder;