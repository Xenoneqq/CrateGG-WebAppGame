import axios from 'axios';
import TradeEntry from '../components/trade-history/TradeEntry';
import './Trades.css'
import { useEffect, useState } from 'react';

function Trades(){

  const [listings, setListings] = useState([])

  const fetchMarketHistory = async () => {
    try {
      
      const token = localStorage.getItem('usertoken');
  
      if (!token) {
        console.error('Token not found. Please log in.');
        return;
      }
  
      // Wykonaj zapytanie do serwera
      const response = await axios.get('http://localhost:8080/market-history//history', {
        headers: {
          Authorization: `Bearer ${token}`, // Przekazanie tokena w nagłówku
        },
      });
  
      // Zwracane dane
      console.log('Market History:', response.data);
      setListings(response.data);
      return response.data; // Możesz zwrócić dane do dalszego wykorzystania
    } catch (error) {
      console.error('Error fetching market history:', error.response?.data || error.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
  
    const pad = (num) => String(num).padStart(2, '0'); // Dodaje 0 z przodu, jeśli potrzeba
  
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1); // Miesiące zaczynają się od 0
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
  
    return `${day}:${month}:${year} ${hours}:${minutes}:${seconds}`;
  };

  const marketDisplay = listings.map((listing) => {
    console.log(listing);
    
    const props = {
      tradeID: listing.id,
      orderDate: formatDate(listing.createdAt),
      crateID: listing.crateID,
      purchased: (listing.buyerID == listing.user.id),
      username: listing.other.username,
      price: listing.price,
      userID: listing.other.id,
      crate: listing.crate,
    }
    
    return(
      <TradeEntry key={listing.id} {...props}/>
    )
  })

  useEffect(() => {
    fetchMarketHistory();
  } , [])

  return(
    <>
    <div className='tradeMarketMain'>
    <div className="tradeHistoryPage">
      <div className="tradePageTitle">Trade History</div>
      {marketDisplay}
    </div>
    </div>
    </>
  )
}

export default Trades;