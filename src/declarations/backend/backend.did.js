export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getRandomCryptos' : IDL.Func([], [IDL.Vec(IDL.Text)], []),
  });
};
export const init = ({ IDL }) => { return []; };
