(function (_Scratch) {
  const {ArgumentType, BlockType, Cast, TargetType, translate, extensions, runtime} = _Scratch;

  class Extension {
    constructor (_runtime) {
      this._runtime = _runtime;
      this.blocks = [
          this.makeBlock(
            'type_of',
            BlockType.REPORTER,
            '[ARGUMENT] 的类型',
            {
              ARGUMENT: {type: ArgumentType.STRING, defaultValue: ""}
            },
            null,
            ({ ARGUMENT }) => {return typeof ARGUMENT;}
          ),
          this.makeBlock(
            'float32Array',
            BlockType.REPORTER,
            'new Float32Array',
            null,
            null,
            () => new Float32Array([1.1, 4.5, 1.4])
          ),
          this.makeBlock(
            'float32ArrayToList',
            BlockType.REPORTER,
            ''
          )
        ];
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
        id: 'justATest',
        name: '测试',
        color1: '#FF8C1A',
        color2: '#DB6E00',
        blocks: this.blocks
      };
    }
  }
  extensions.register(new Extension(runtime));
})(Scratch);