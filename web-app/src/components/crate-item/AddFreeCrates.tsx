import axios from 'axios';
import './CrateDisplay.css'
import { useState } from 'react';
const cratePath = '/crates'

const getFreeCrates = () => {

}

function AddFreeCrates(){
  const [free, setFree] = useState(-1);
  
  const fetchCrateData = async () => {
    try {
      const token = localStorage.getItem("usertoken");
      const response = await axios.get("http://localhost:8080/crates/wooden-crates", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.woodenCratesCount);
      setFree(response.data.woodenCratesCount);
    } catch (error) {
      console.error(error);
      setFree(-1);
    }
  };

  fetchCrateData()

  if(free != 0){
    return(<></>);
  }
  
  return (
    <>
    <div
     className="itemCardStorage"
     >
      <div className='itemName'>Free Crates?</div>
      <div>
        <img draggable={false} className='crateImageItem' src={'/sprites/free.png'}></img>
      </div>
      <div>
        No wooden crates?<br/>
      </div>
    </div>
    </>
  )
}

export default AddFreeCrates;