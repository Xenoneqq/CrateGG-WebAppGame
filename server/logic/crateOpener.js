function OpenCrate(crateID){
  switch(crateID){
    case 'wooden_crate':{
      return [Open(crateID)];
    }
    default:{
      console.log('Crate does not exist! - ' + crateID)
      return null;
    }
  }
}

function Open(crateID){
  switch(crateID){
    case 'wooden_crate':{
      return wooden_crate();
    }
    default:{
      console.log('Crate does not exist!')
      return null;
    }
  }
}

function GetPattern(){
  return Math.floor(Math.random() * 1000);
}

function Draw(dropPool, odds){
  const sum = 0;
  odds.map((odd) => {sum += odd})
  let rand = Math.random() * sum;
  let id = 0;
  while(rand > 0){
    rand -= odds[i];
    if(rand <= 0) return dropPool[id];

  } 
}

function wooden_crate(){
  const wooden_crate_pool = [
    {crate:'wooden_crate', name:'wooden crate', rarity:0},
    {crate:'iron_crate', name:'iron crate',rarity:0},
    {crate:'reinforced_crate',name:'reinforced crate',rarity:0},
    {crate:'old_crate',name:'old crate',rarity:1},
    {crate:'golden_crate',name:'golden crate',rarity:1},
  ]

  const odds = [
    30,10,10,10,3
  ]
  
  const pick = Draw(wooden_crate_pool, odds);

  const crate = {
    patternIndex: (GetPattern()),
    crateAssetID: pick.crate,
    rarity: pick.rarity,
    name: pick.name,
  }

  return crate;
}

module.exports = OpenCrate;