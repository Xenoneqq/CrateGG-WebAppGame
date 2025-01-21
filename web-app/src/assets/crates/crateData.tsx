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