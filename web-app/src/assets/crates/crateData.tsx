interface crate {
  crateID:string,
  imagePathPatternCallback:unknown // callback function! path related to crates folder!!!
}

const cratesDatabase:[crate] = [
  {
    crateID:'wooden_crate',
    imagePathPatternCallback:(pattern:number) => {
      if(pattern == 753) return '/wooden/r_wooden.png';
      return '/wooden/crate_' + Math.floor(pattern/350) + '.png';
    }
  },
  {
    crateID:'iron_crate',
    imagePathPatternCallback:(pattern:number) => {
      return '/iron/crate_' + Math.floor(pattern/300) + '.png';
    }
  },
  {
    crateID:'reinforced_crate',
    imagePathPatternCallback:(pattern:number) => {
      if(pattern == 333 || pattern == 456 || pattern > 995) return '/reinforced/r_reinforced.png';
      return '/reinforced/crate_' + Math.floor(pattern/400) + '.png';
    }
  },
  {
    crateID:'old_crate',
    imagePathPatternCallback:(pattern:number) => {
      if(pattern > 190 && pattern < 200) return '/old_crate/r_old_crate.png';
      return '/old_crate/crate_' + Math.floor(pattern/501) + '.png';
    }
  },
  {
    crateID:'golden_crate',
    imagePathPatternCallback:(pattern:number) => {
      if(pattern == 999) return '/golden_crate/r_golden_crate.png';
      return '/golden_crate/crate_' + Math.floor(pattern/501) + '.png';
    }
  },
  {
    crateID:'refined_crate',
    imagePathPatternCallback:(pattern:number) => {
      return '/refined/crate_' + Math.floor(pattern/315) + '.png';
    }
  },
  {
    crateID:'grass_crate',
    imagePathPatternCallback:(pattern:number) => {
      if(pattern >= 230 && pattern <= 255)
        return '/grass/r_grass_crate'
      return '/grass/crate_' + Math.floor(pattern/501) + '.png';
    }
  },
  {
    crateID:'magical_crate',
    imagePathPatternCallback:(pattern:number) => {
      if(pattern >= 666 && pattern <= 676)
        return '/magical/r_magical_crate'
      return '/magical/crate_' + Math.floor(pattern/501) + '.png';
    }
  },
  {
    crateID:'magma_crate',
    imagePathPatternCallback:(pattern:number) => {
      return '/magma/crate_' + Math.floor(pattern/201) + '.png';
    }
  },
]

const createCrateMap = (database) => {
  return database.reduce((acc, crate) => {
    acc[crate.crateID] = crate; // Ustawiamy klucz crateID i przypisujemy obiekt
    return acc;
  }, {});
};

const crates = createCrateMap(cratesDatabase);

function getCrate(id){
  return crates[id];
}

export default getCrate;