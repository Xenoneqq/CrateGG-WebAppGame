const cratePath = '../crates/crates';
import './Crateorder.css'

function Crateorder(){
  const crate = {
    crateID:'wooden_crate',
    name:'wooden crate',
    rarity:'common',
    imagePathPatternCallback:(pattern:number) => {
      return '/wooden/crate_0.png';
    }
  }

  return(
    <>
    <div className="crateOrder">
      <div className='crateName'>{crate.name}</div>
      <img src={'../../assets/crates/crates/wooden/crate_0.png'}></img>
      <button className='buyButton'>Buy 100CC</button>
    </div>
    </>
  )
}

export default Crateorder;