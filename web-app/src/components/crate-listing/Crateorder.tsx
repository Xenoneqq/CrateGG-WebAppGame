const cratePath = '/crates';
import './Crateorder.css'

function Crateorder(crate, listing){
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
    <div className="crateOrder">
      <div className='crateName' style={{color: color(crate.rarity)}}>{crate.name}</div>
      <img className="crateImage" src={cratePath + crate.imagePathPatternCallback(0)}></img>
      <button className='buyButton'>Buy 100CC</button>
    </div>
    </>
  )
}

export default Crateorder;