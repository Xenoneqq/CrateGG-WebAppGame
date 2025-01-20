interface crate {
  crateID:string,
  name:string,
  rarity:string,
  imagePathPatternCallback:unknown // callback function! path related to crates folder!!!
}

const crates:[crate] = [
  {
    crateID:'wooden_crate',
    name:'wooden crate',
    rarity:'common',
    imagePathPatternCallback:(pattern:number) => {
      if(pattern == 753) return '/wooden/r_wooden';
      return '/wooden/crate_' + pattern%1000;
    }
  },
]

export default crates;