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

  const [rarityFilter, setRarityFilter] = useState('');
  const [name, setName] = useState("");
  const [order, setOrder] = useState('0');
  const [sortDirection, setSortDirection] = useState('0');


  const { updateCurrency } = useOutletContext();

  const getMarketData = async () => {
    const queryParams = [];
  
    // Sprawdzanie wartości
    console.log('Order:', order);
    console.log('Rarity Filter:', rarityFilter);
    console.log('Name:', name);
  
    if (name) queryParams.push(`name=${encodeURIComponent(name)}`);
    if (rarityFilter) queryParams.push(`rarity=${rarityFilter}`);
    if (order) {
      const orderBy = order === '1' ? 'price' : order === '2' ? 'rarity' : 'createdAt';
      const direction = sortDirection === '0' ? 'DESC' : 'ASC';
      queryParams.push(`orderby=${orderBy}&direction=${direction}`);
    }
  
    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
  
    try {
      const response = await axios.get(`http://localhost:8080/market/search${queryString}`);
      console.log(response.data);
      setMarket(response.data);
    } catch (error) {
      console.error('Error fetching market data:', error);
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
      crateName: selected.crate.name,
      crateRarity: selected.crate.rarity,
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
  }, [purchaseDetected, name, rarityFilter, order, sortDirection])

  const marketDisplay = market.map((entry) => {
    return(
      <Crateorder onClick={() => {activatePanel(entry.id)}} key={entry.id} {...entry}/>
    )
  })

  return(
    <>
    {displayPanel()}
    <div className="searchOptions">
      <div>
      Search by Name <br/>
      <input className="inputPanels"
      value={name}
      onChange={(e) => setName(e.target.value)}
      >
      </input>
      </div>

      <div>
      Rarity <br/>
      <select className="selectPanels" onChange={(e) => setRarityFilter(e.target.value)}>
        <option value="">All</option>
        <option value="0">Common</option>
        <option value="1">Rare</option>
        <option value="2">Legendary</option>
      </select>
      </div>

      <div>
      Order by <br/>
      <select className="selectPanels" onChange={(e) => setOrder(e.target.value)}>
        <option value="0">Newest</option>
        <option value="1">Price</option>
        <option value="2">Rarity</option>
      </select>
      </div>

      <div>
      Direction <br/>
      <select className="selectPanels" onChange={(e) => setSortDirection(e.target.value)}>
        <option value="0">DESCENDING</option>
        <option value="1">ASCENDING</option>
      </select>
      </div>
    </div>
    <div className="crateMarket">
    {marketDisplay}
    </div>
    </>
  )
}

export default Cratepanel;