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
      setMarket(response.data);
    } catch (error) {
      alert(error.response.data.message);
      console.error('Error fetching market data:', error);
    }
  }
  

  const purchase = async () => {
    try{
      const token = localStorage.getItem('usertoken');
      const userID = localStorage.getItem('userid');

      if (!token || !userID) {
        alert('Log in to purchase an item')
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
      alert(error.response.data.message);
      console.error(error);
    }
  }

  const removeListing = async (crateID) => {
    const token = localStorage.getItem('usertoken');
  
    try {
      const response = await axios.delete(`http://localhost:8080/market/removeFromMarket/${crateID}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }

    setSelected(null);
    setPurchaseDetected(purchaseDetected * -1);
  };

  const cancelPurchase = async () => {
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

  console.log(selected);
  const displayPanel = () => {
    if(selected == null) return(<></>);
    const props = {
      crateID: selected.crate.crateAssetID,
      crateName: selected.crate.name,
      crateRarity: selected.crate.rarity,
      cratePattern: selected.crate.patternIndex,
      price: selected.price,
      ownerName: selected.user.username,
      sellerID: selected.sellerID,
      close: cancelPurchase,
      purchase: purchase,
      remove: () => {removeListing(selected.crate.id)},
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
    {displayPanel()}
    </div>
    </>
  )
}

export default Cratepanel;