getScratchList(name, util) {
  if (name == "empty") return "";
    let list = util.target.lookupVariableById(name);
  if (!list) {
    list = util.target.lookupVariableByNameAndType(name, "list");
    if (!list) return "";
  }
  return list;
}

getScratchListValue(name, util) {
  return getScratchList(name, util).value;
}