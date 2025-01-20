import axios from "axios";
import { useEffect, useState } from "react";
import Crateorder from "./Crateorder";
import './Cratepanel.css';
import CrateBuyPanel from "../crate-buy/CrateBuyPanel";

import { useOutletContext } from "react-router-dom";

function Cratepanel(){
  const [market, setMarket] = useState([]);
  const [selected, setSelected] = useState(null)
  const [purchaseDetected, setPurchaseDetected] = useState(1);

  const { updateCurrency } = useOutletContext();

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

  const purchase = async () => {
    try{
      const token = localStorage.getItem('usertoken');
      const userID = localStorage.getItem('userid');

      if (!token || !userID) {
        throw new Error('User is not authenticated.');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      console.log("To this point worked!")

      const res = await axios.post(
        'http://localhost:8080/market/buy',
        { userID, marketID:selected.id },
        config
      );

      // Obsłuż odpowiedź
      if (res.status === 200) {
        setSelected(null);
        setPurchaseDetected(purchaseDetected * -1);
        updateCurrency(res.data.currency);
      }

    } catch (error) {
      console.error(error);
    }
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
  }, [purchaseDetected])

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