import { useState } from 'react';
import CrateSellPanel from '../crate-sell/crateSellPanel';
import './CrateInfo.css'
import getCrate from '../../assets/crates/crateData';
import axios from 'axios';

const cratePath = '/crates';

function CrateInfo(props){
  const [visible, setVisible] = useState(true);
  const [offerWindow, setOfferWindow] = useState(false);

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
      console.error(error);
    }
    
    props.sellAction();
    setVisible(false);
  }

  const backToItem = () => {
    setOfferWindow(false);
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
            <button onClick={openOfferWindow} className='purchase'>
              Sell
            </button>
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
    </>
  )
}

export default CrateInfo;