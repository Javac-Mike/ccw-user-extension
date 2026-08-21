(function (_Scratch){
  const {ArgumentType, BlockType, TargetType, Cast, translate, extensions, runtime} = _Scratch;
  class ListTest{
    constructor (_runtime) {
      this._runtime = _runtime;
    }

    get runtime() {
      return _Scratch.runtime;
    }

    makeBlock(opcode, blockType, text, args, filter, func) {
      eval('this.'+opcode+'=func;');
      let block = {opcode, blockType, text};
      if (args) {
        block.arguments = args;
      }
      if (filter) {
        block.filter = filter;
      }
      return block;
    }

    getInfo () {
      return {
        id: 'listtest',
        name: "List Test",
        color1: '#FF8C1A',
        color2: '#DB6E00',
        menus: {
          LIST_MENU: {
            acceptReporters: true,
            items: "listMenu",
          },
        },
        blocks: [
          {
            opcode: "listTest",
            blockType: BlockType.COMMAND,
            text: "List Test [LIST]",
            disableMonitor: true,
            arguments: {
              LIST: {
                type: ArgumentType.STRING,
                menu: "LIST_MENU"
              }
            }
          }
        ]
      }
    }

    listTest(args, util) {
      let list = this.getScratchList(args.LIST, util);
      console.log(list);
      console.log(typeof list);
      console.log("================");
    }

    listMenu() {
      const menus = [];
      let { variables } = this.runtime._stageTarget;
      Object.keys(variables).forEach((variable) => {
        if (variables[variable].type === "list") {
          menus.push({
            text: variables[variable].name,
            value: variables[variable].id,
          });
        }
      });
      try {
        variables = this.runtime._editingTarget.variables;
      } catch (e) {
        variables = "error";
      }
      if (variables !== "error" && this.runtime._editingTarget !== this.runtime._stageTarget) {
        Object.keys(variables).forEach((variable) => {
          if (variables[variable].type) {
            menus.push({
              text: `[PRIVATE] ${variables[variable].name}`,
              value: variables[variable].id,
            });
          }
        });
      }
      if (menus.length === 0) {
        menus.push({
          text: "-",
          value: "empty",
        });
      }
      return menus;
    }

    getScratchList(NAME, util) {
      if (NAME === "empty") return "";
      let list = util.target.lookupVariableById(NAME);
      if (!list) {
        list = util.target.lookupVariableByNameAndType(NAME, "list");
        if (!list) return "";
      }
      return list.value;
    }
  }
  extensions.register(new ListTest(runtime));
})(Scratch);