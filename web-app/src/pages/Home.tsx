import './Home.css'

function Home(){

  const sentToLogin = (isUser) => {
    window.location.href = `/login?isUser=${isUser}`
  }

  return(
    <>
    <div className="mainPage">
    <div className='mainPageContents'>

    <div className='mainGameLogo'>CRATE.GG</div>

    <div className='cardGridPanel'>
      <div className='mainPageCard'>
        <h3>Open Crates</h3>
        <div className='centeredFlex'>
          Uncover what's inside.
          Each crate is a mystery waiting to be revealed.
        </div>
      </div>

      <div className='mainPageCard'>
        <h3>Trade Crates</h3>
        <div className='centeredFlex'>
          Turn your finds into fortune.
          Exchange crates with others to grow your collection.
        </div>
      </div>

      <div className='mainPageCard'>
        <h3>Collect Crates</h3>
        <div className='centeredFlex'>
          Build your legendary storage.
          Hunt for the rarest crates and become a top collector.
        </div>
      </div>

      <div className='mainPageCard'>
        <h3>GET</h3>
        <div className='centeredFlex'>
          <img  className='mainPageCratePhoto' src='/crates/old_crate/crate_1.png'/>
        </div>
      </div>

      <div className='mainPageCard'>
        <h3>THEM</h3>
        <div className='centeredFlex'>
          <img  className='mainPageCratePhoto' src='/crates/iron/crate_2.png'/>
        </div>
      </div>

      <div className='mainPageCard'>
        <h3>ALL!</h3>
        <div className='centeredFlex'>
          <img  className='mainPageCratePhoto' src='/crates/golden_crate/r_golden_crate.png'/>
        </div>
      </div>

    </div>

    <div className='mainPageTitle'>Wanna start Playing?</div>

    <div className='cardGridPanel'>
      <div className='mainPageCard'>
        <h3>NEWCOMER</h3>
        <div className='centeredFlex'>
          <img  className='profilePagePhoto' src='/sprites/beginner.png'/>
        </div>
        <div style={{height:'25px'}}></div>
        <button onClick={() => {sentToLogin(0)}} className='signInButton' >REGISTER</button>
      </div>
      <div className='mainPageCard'>
        <h3>MEMBER</h3>
        <div className='centeredFlex'>
          <img  className='profilePagePhoto' src='/sprites/gamer.png'/>
        </div>
        <div style={{height:'25px'}}></div>
        <button onClick={() => {sentToLogin(1)}} className='signInButton' >SIGN IN</button>
      </div>
    </div>

    <div style={{height:'100px'}}></div>

    </div>
    </div>
    </>
  )
}

export default Home;