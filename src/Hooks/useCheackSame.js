function useCheackSame(parent, child, same) {
  let filteredParent = parent.filter((par) =>
    child.some((cld) => par[same] !== cld[same])
  );
  return filteredParent;
}

export default useCheackSame;