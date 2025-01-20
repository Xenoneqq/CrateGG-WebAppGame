import axios from "axios";
import { useEffect, useState } from "react";
import Crateorder from "./Crateorder";
import './Cratepanel.css';
import CrateBuyPanel from "../crate-buy/CrateBuyPanel";

function Cratepanel(){
  const [market, setMarket] = useState([]);
  const [selected, setSelected] = useState(null)

  const getMarketData = async () => {
    try{
      const res = await axios.get('http://localhost:8080/market/alldata');
      if(res.data != null){
        setMarket(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const purchase = () => {
    alert('Purchased!');
  }

  const cancelPurchase = () => {
    setSelected(null);
  }

  const activatePanel = (transactionID) => {
    for(let i = 0; i < market.length; i++){
      if(market[i].id == transactionID){
        console.log(market[i]);
        setSelected(market[i]);
        return;
      }
    }
    setSelected(null);
  }

  const displayPanel = () => {
    if(selected == null) return(<></>);
    const props = {
      crateID: selected.crate.crateAssetID,
      cratePattern: selected.crate.patternIndex,
      price: selected.price,
      ownerName: selected.user.username,
      close: cancelPurchase,
      purchase: purchase,
    }
    return(
      <div className='buyPanel'>
      <CrateBuyPanel {...props}/>
      </div>
    )
  }

  useEffect(() => {
    getMarketData();
  }, [])

  const marketDisplay = market.map((entry) => {
    return(
      <Crateorder onClick={() => {activatePanel(entry.id)}} key={entry.id} {...entry}/>
    )
  })

  return(
    <>
    {displayPanel()}
    <div className="crateMarket">
    {marketDisplay}
    </div>
    </>
  )
}

export default Cratepanel;