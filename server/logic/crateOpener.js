function OpenCrate(crateID){
  switch(crateID){
    case 'reinforced_crate':{
      return [Open(crateID), Open(crateID)]
    }
    case 'magical_crate':{
      return [Open(crateID), Open(crateID), Open(crateID)]
    }
    case 'magma_crate':{
      return [Open(crateID), Open(crateID), Open(crateID),Open(crateID),Open(crateID)]
    }
    default:{
      return [Open(crateID)];
    }
  }
}

function Open(crateID){
  console.log(crateID);
  switch(crateID){
    case 'wooden_crate': return wooden_crate();
    case 'iron_crate': return better_crate();
    case 'reinforced_crate': return better_crate();
    case 'old_crate': return better_crate();
    case 'golden_crate': return moderate_crate();
    case 'refined_crate': return moderate_crate();
    case 'grass_crate': return moderate_crate();
    case 'magical_crate': return moderate_crate();
    case 'magma_crate': return moderate_crate();

    default:{
      console.log('Crate does not exist!')
      return null;
    }
  }
}

function GetPattern(){
  return Math.floor(Math.random() * 1000);
}

function Draw(dropPool){
  let sum = 0;
  for(let i = 0; i < dropPool.length; i++) sum += dropPool[i][1]
  let rand = Math.floor(Math.random() * sum);
  let id = 0;
  while(rand > 0){
    rand -= dropPool[id][1];
    if(rand <= 0) return dropPool[id][0];
    id += 1;
  } 
}

function GetRarity(crateID){
  switch(crateID){
    case 'wooden_crate': return 0;
    case 'iron_crate': return 0;
    case 'reinforced_crate': return 0;
    case 'old_crate': return 1;
    case 'golden_crate': return 1;
    case 'refined_crate': return 1;
    case 'grass_crate': return 1;
    case 'magical_crate': return 1;
    case 'magma_crate': return 2;
  }
}

function GetName(crateID){
  switch(crateID){
    default: return crateID.replace(/_/g, ' ');
  }
}

function MakeCrate(pick){
  const crate = {
    patternIndex: (GetPattern()),
    crateAssetID: pick,
    rarity: (GetRarity(pick)),
    name: (GetName(pick)),
  }
  return crate;
}

// CRATES

function wooden_crate(){
  const wooden_crate_pool = [
    [null , 30],
    ['wooden_crate' , 30],
    ['iron_crate' , 10],
    ['reinforced_crate', 10],
    ['old_crate' , 10],
    ['golden_crate' , 3],
  ]
  
  const pick = Draw(wooden_crate_pool);

  if(pick == null) return null;
  return MakeCrate(pick);
}

function better_crate(){
  const better_crate_pool = [
    [null , 10],
    ['reinforced_crate' , 4],
    ['old_crate' , 6],
    ['iron_crate' , 8],
    ['wooden_crate' , 20],
    ['iron_crate' , 20],
    ['golden_crate' , 18],
    ['refined_crate' , 10],
    ['grass_crate' , 8],
  ]
  
  const pick = Draw(better_crate_pool);

  if(pick == null) return null;
  return MakeCrate(pick);
}

function moderate_crate(){
  const moderate_crate_pool = [
    ['old_crate' , 6],
    ['iron_crate' , 8],
    ['golden_crate' , 20],
    ['refined_crate' , 15],
    ['grass_crate' , 15],
    ['corrupted_crate' , 10],
    ['magical_crate' , 10],
    ['magma_crate' , 5],
  ]
  
  const pick = Draw(moderate_crate_pool);

  if(pick == null) return null;
  return MakeCrate(pick);
}

module.exports = OpenCrate;