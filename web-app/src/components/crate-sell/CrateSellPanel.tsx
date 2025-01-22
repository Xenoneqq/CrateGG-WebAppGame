import { useState } from 'react';
import './CrateSellPanel.css'

function CrateSellPanel(props){
  const [price, setPrice] = useState(0);

  const passToInput = (val) => {
    if(val == "" || typeof parseInt(val) !== "number" || isNaN(val)){
      setPrice(0);
    }
    else{
      setPrice(parseInt(val));
    }
  }

  const sell = () => {
    props.sellOrder(price);
  }

  return(
    <div className='crateSellingPanel'>
      <div className='panelSellOption'>
        Your Price<br/>
        <input className='panelSellInput'
          value={price}
          onChange={(e) => {passToInput(e.target.value)}}
        >
        </input>
      </div>

      <div className='panelSellOption'>
        <button onClick={sell} className='sellPanelButton'>Create Sell Order</button>
        <button onClick={props.back} className='sellPanelButton'>Close</button>
      </div>
    </div>
  )
}

export default CrateSellPanel;