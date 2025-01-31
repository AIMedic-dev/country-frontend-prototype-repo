type HexColor = `#${string}`;

const blue1: HexColor = '#030D46';
const blue2: HexColor = '#262FE1';
const blue3: HexColor = '#19BBCF';
const pink1: HexColor = '#CD2D89';
const orange1: HexColor = '#ED273C';
const white1: HexColor = '#F0F0EB';

type Colors = {
  blue: {
    1: HexColor;
    2: HexColor;
    3: HexColor;
  };
  pink: {
    1: HexColor;
  };
  orange: {
    1: HexColor;
  };
  white: {
    1: HexColor;
  };
};

export const colors: Colors = {
  blue: {
    1: blue1,
    2: blue2,
    3: blue3,
  },
  pink: {
    1: pink1,
  },
  orange: {
    1: orange1,
  },
  white: {
    1: white1,
  },
};
