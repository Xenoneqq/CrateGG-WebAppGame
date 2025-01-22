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
      return '/golden_crate/crate_' + Math.floor(pattern/400) + '.png';
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