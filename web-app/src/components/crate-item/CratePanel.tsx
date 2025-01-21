import { useEffect, useState } from "react";
import axios from "axios";
import CrateDisplay from "./CrateDisplay";
import './CratePanel.css'
import CrateInfo from "./CrateInfo";

function CratePanel(){
  const [crates, setCrates] = useState([]);
  const [selected, setSelected] = useState(null);

  const userID = localStorage.getItem("userid");

  const fetchCrates = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/crates/user/${userID}`);
      console.log(response.data)
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

  const closePanel = () => {
    setSelected(null);
  }

  useEffect(() => {
    if (userID) {
      fetchCrates();
    }
  }, []);

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
      <CrateInfo {...props}/>
      </div>
    )
  }
  
  return(
    <>
      {displayCrateInfoPanel()}
      <div className="crateStoragePanel">
        {cratesDisplay}
      </div>
    </>
  )
}

export default CratePanel;