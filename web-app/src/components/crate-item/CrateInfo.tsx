import { useState } from 'react';
import CrateSellPanel from '../crate-sell/crateSellPanel';
import './CrateInfo.css'
import getCrate from '../../assets/crates/crateData';
import axios from 'axios';
import CrateOpenPanel from '../crate-open/CrateOpenPanel';
import CratePanel from './CratePanel';

const cratePath = '/crates';

function CrateInfo(props){
  const [visible, setVisible] = useState(true);
  const [offerWindow, setOfferWindow] = useState(false);
  const [openWindow, setOpenWindow] = useState(false);

  const crate = getCrate(props.crateAssetID);
  const getRarity = (rarityNum) => {
    switch(rarityNum){
      case 0: return 'common'
      case 1: return 'rare'
      case 2: return 'legendary'
      default: return 'undefined'
    }
  }

  const openOfferWindow = () => {
    setOfferWindow(true);
    setVisible(false);
  }

  const openOpeningWindow = () => {
    setOpenWindow(true);
    setVisible(false);
  }

  const user = localStorage.getItem("userid");
  const token = localStorage.getItem("usertoken");
  
  const setupOrder = async (price) => {
    try {
      const response = await axios.post('http://localhost:8080/market/sell', {
        crateID:props.id,
        userID:user,
        price,
      },{
        headers: {
          Authorization: `Bearer ${token}`, // Klucz JWT w nagłówku
        },
      });
      console.log('Crate listed successfully:', response.data);
    } catch (error) {
      alert(error.response.data.message);
      console.error(error);
    }
    
    props.updateAction();
    props.closeAction();
    setVisible(false);
  }

  const OpenCrate = async () => {
    console.log('Opening crate with ID:', props.id);

    try {
      const token = localStorage.getItem('usertoken');
  
      const response = await axios.post(
        'http://localhost:8080/crates/openCrate',
        { crateID: props.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log('Crate opened successfully:', response.data);
      props.updateAction();
      backToItem();
      props.closeAction();
      setVisible(false);
      props.openedCrates(response.data.newCrates)
      props.showDrops(true);
    } catch (error) {
      alert(error.response.data.message);
      console.error(error);
    }
  }

  const removeCrateFromMarket = async (crateID) => {
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

    props.closeAction();
    props.updateAction();
    setVisible(false);
  };

  const backToItem = () => {
    setOfferWindow(false);
    setOpenWindow(false);
    setVisible(true);
  }

  const drawOfferWindow = () => {
    if(offerWindow){
      return(
      <>
        <CrateSellPanel {...props} sellOrder={setupOrder} back={backToItem}/>
      </>
      )
    }
    return(<></>)
  }

  const drawOpenWindow = () => {
    const crateImage = (cratePath + crate.imagePathPatternCallback(props.patternIndex));
    
    if(openWindow){
      return(
      <>
        <CrateOpenPanel crateImage={crateImage} {...props} openOrder={OpenCrate} back={backToItem}/>
      </>
      )
    }
    return(<></>)
  }

  const onMarket = () => {
    return (props.crateMarkets != null && props.crateMarkets.length != 0)
  }

  const checkActionButton = () => {
    if(onMarket()){
      return(
        <>
        <button onClick={() => {removeCrateFromMarket(props.id)}} className='purchase'>
              Remove from market
        </button>
        </>
      )
    }
    return(
      <>
      <button onClick={openOfferWindow} className='purchase'>
            Sell on market
      </button>
      </>
    )
  }

  const renderWindow = () => {
    if(visible){
    return(
      <>
      <div className="crateInfoPanelTwo">
        <div className='name'>{props.name}</div>
        <div style={{display: 'flex', flexDirection:'row', gap:'15px', flexWrap:'wrap', justifyContent:'center', alignItems:'center'}}>
          <div className='panelCard' style={{justifyContent:'center', alignItems:'center'}}>
            <img width={'200px'} style={{imageRendering:'pixelated', userSelect:'none'}} draggable={false} src={(cratePath + crate.imagePathPatternCallback(props.patternIndex))}></img>
          </div>
          <div style={{width:'300px'}} className='panelCard'>
            <div>
              Rarity : <b>{getRarity(props.rarity)}</b> <br/>
              Pattern index : <b>{props.patternIndex}</b> <br/>
              Crate type ID : <b>{props.crateAssetID}</b>
            </div>
          </div>
        </div>
          <div className="bottomNav">
            <button onClick={props.cancle} className='cancel'>
              Close
            </button>
            <button onClick={openOpeningWindow} className='cancel'>
              Open Crate
            </button>
            {checkActionButton()}
          </div>
        </div>
      </>
      )
    }
    return (<></>)
  }

  return(
    <>
      {renderWindow()}
      {drawOfferWindow()}
      {drawOpenWindow()}
    </>
  )
}

export default CrateInfo;