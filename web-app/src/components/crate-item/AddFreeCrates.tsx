import axios from 'axios';
import './CrateDisplay.css'
import { useState } from 'react';
const cratePath = '/crates'

const getFreeCrates = () => {

}

function AddFreeCrates(props){
  const [free, setFree] = useState(-1);
  const fetchCrateData = async () => {
    try {
      const token = localStorage.getItem("usertoken");
      const response = await axios.get("http://localhost:8080/crates/wooden-crates", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFree(response.data.woodenCratesCount);
    } catch (error) {
      console.error(error);
      setFree(-1);
    }
  };

  const getFreeCrates = async () => {
    try {
      const token = localStorage.getItem("usertoken");
      const response = await axios.post("http://localhost:8080/crates/add-wooden-crates", {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      props.drawCases();
      setFree(-1);
    } catch (error) {
      console.error("Error adding wooden crates:", error);
      alert("Failed to add wooden crates.");
    }
  }

  const getUserCheck = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const userIDFromUrl = queryParams.get('userID');
    if(userIDFromUrl === undefined || userIDFromUrl === null) return true;
    if(userIDFromUrl == localStorage.getItem("userid")) return true;
    return false;
  }

  fetchCrateData()

  if(free != 0 || getUserCheck() == false){
    return(<></>);
  }
  
  return (
    <>
    <div
      onClick={getFreeCrates}
     className="itemCardStorage"
     >
      <div className='itemName'>Free Crates</div>
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