import { useEffect, useState } from "react";
import axios from "axios";
import CrateDisplay from "./CrateDisplay";
import './CratePanel.css'
import CrateInfo from "./CrateInfo";
import AddFreeCrates from "./AddFreeCrates";

function CratePanel(){
  const [crates, setCrates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [drawCrates, setDrawCrates] = useState(1);

  const [rarityFilter, setRarityFilter] = useState('');
  const [name, setName] = useState("");
  const [order, setOrder] = useState('0');
  const [sortDirection, setSortDirection] = useState('0');

  const userID = localStorage.getItem("userid");

  const closeWindow = () => {  
    setSelected(null);
  }

  const fetchCratesOld = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/crates/userandmarket/${userID}`);
      setCrates(response.data);
    } catch (err) {
      console.error("Error fetching crates:", err);
    }
  };

  const activatePanelInfo = (crateID) => {
    for(let i = 0; i < crates.length; i++){
      if(crates[i].id == crateID){
        setSelected(crates[i]);
        return;
      }
    }
    setSelected(null);
  }

  const fetchCrates = async () => {
    // Extract userID from the URL query parameters
    let userID = new URLSearchParams(window.location.search).get("userID");
    
    if(userID === undefined || userID === null){
      userID = localStorage.getItem("userid");
    }

    try {
      const response = await axios.get("http://localhost:8080/crates/filtered", {
        params: {
          userID,
          name: name || undefined,
          rarity: rarityFilter || undefined,
          order,
          sortDirection: sortDirection,
        },
      });
      setCrates(response.data);
    } catch (error) {
      console.error("Error fetching crates:", error);
    }
  };
  

  const closePanel = () => {
    setSelected(null);
  }

  useEffect(() => {
    if (userID) {
      fetchCrates();
    }
  }, [drawCrates, rarityFilter,name,order,sortDirection]);

  const drawCases = () => {
    setDrawCrates(drawCrates * -1);
  }

  const cratesDisplay = crates.map((crate) => {
    return(<CrateDisplay onClick={()=>{activatePanelInfo(crate.id)}} key={crate.id} {...crate}/>)
  })

  const displayCrateInfoPanel = () => {
    if(selected == null) return(<></>);
    const props = {
      cancle: () => {closePanel()}
    }
    return(
      <div className='buyPanel'>
      <CrateInfo {...props} {...selected} closeAction={closeWindow} updateAction={drawCases}/>
      </div>
    )
  }
  
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

      <div className="crateStoragePanel">
        <AddFreeCrates/>
        {cratesDisplay}
      </div>
      {displayCrateInfoPanel()}
    </>
  )
}

export default CratePanel;