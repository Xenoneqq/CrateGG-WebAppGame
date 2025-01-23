import './CrateBuyPanel.css'
import getCrate from '../../assets/crates/crateData';

const cratePath = '/crates';

function CrateBuyPanel(props){
  const crate = getCrate(props.crateID);

  const getRarity = (rarityNum) => {
    switch(rarityNum){
      case 0: return 'common'
      case 1: return 'rare'
      case 2: return 'legendary'
      default: return 'undefined'
    }
  }

  const drawPurchaseButton = () => {
    if(props.sellerID == localStorage.getItem("userid")) return(<></>);
    return(
      <>
      <button onClick={props.purchase} className='purchase'>
          BUY for {props.price} CC
        </button>
      </>
    )
  }

  const drawRemoveButton = () => {
    const role = localStorage.getItem("userrole");
    if(props.sellerID != localStorage.getItem("userid")
      && role != 'admin') return(<></>);

    return(
      <>
      <button onClick={props.remove} className='purchase'>
          Remove from market
        </button>
      </>
    )
  }

  const takeToOwnersSite = (ownerID) => {
    window.location.href = '/storage?userID=' + ownerID; 
  }

  return(
    <>
    <div className='crateTransaction'>
      <div className='name'>{props.crateName}</div>
      <div className='crateInfoPanel'>
        <div className='panelCard' style={{justifyContent:'center', alignItems:'center'}}>
          <img width={'200px'} style={{imageRendering:'pixelated', userSelect:'none'}} draggable={false} src={cratePath + crate.imagePathPatternCallback(props.cratePattern)}></img>
        </div>
        <div style={{width:'300px'}} className='panelCard'>
          <div onClick={() => {takeToOwnersSite(props.sellerID)}}
          className='crateOwner ownerLinkButton'>
            Owner : {props.ownerName}
          </div>
          <div>
            Rarity : <b>{getRarity(props.crateRarity)}</b> <br/>
            Pattern index : <b>{props.cratePattern}</b> <br/>
            Crate type ID : <b>{crate.crateID}</b>
          </div>
          <div>
            Selling for : <b>{props.price} CC</b>
          </div>
        </div>
      </div>

      <div className="bottomNav">
        <button onClick={props.close} className='cancel'>
          Close
        </button>
        {drawPurchaseButton()}
        {drawRemoveButton()}
      </div>
    </div>
    </>
  )
}

export default CrateBuyPanel;