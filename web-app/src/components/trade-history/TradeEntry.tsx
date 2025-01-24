import './TradeEntry.css';
const cratePath = '/crates';
import getCrate from '../../assets/crates/crateData'

function TradeEntry(props){

  const crate = getCrate(props.crate.crateAssetID);
  console.log(props);
  const displayPrice = () => {
    if(props.purchased){
      return (<>BOUGHT FOR <span className="tradeMarketHistoryPrice">
        {props.price}</span></>)
    }
    return (<>SOLD FOR <span className="tradeMarketHistoryPrice">
      {props.price}</span></>)
  }

  const bringToUser = () => {
    window.location.href = `/storage?userID=${props.userID}`
  }

  const displayOwner = () => {
    if(props.purchased){
      return (
      <>
      Seller : <span
       onClick={bringToUser}
       className='crateOwner ownerLinkButton'
       >{props.username}</span>
      </>)
    }
    return (
      <>
      Buyer : <span
       onClick={bringToUser}
       className='crateOwnerListing ownerLinkButton'
       >{props.username}</span>
      </>
    )
  }

  const getListingColor = () => {
    if(props.purchased){
      return 'rgb(90, 255, 100)'
    }
    return 'rgb(255, 222, 90)'
  }

  return(
    <>
    <div 
    style = {{borderColor:(getListingColor())}}
    className="tradeMarketListing">
      <div>
        Trade ID : {props.tradeID} - {displayPrice()} <br/>
        Date : {props.orderDate} <br/>
        {displayOwner()} <br/>
        Crate ID: {props.crate.id}
      </div>
      <div className='tradeMarketCrateImage'>
      <img className='crateImageTradeListing' src={cratePath + crate.imagePathPatternCallback(props.crate.patternIndex)} draggable={false}></img>
    </div>
    </div>
    </>
  )
}

export default TradeEntry;