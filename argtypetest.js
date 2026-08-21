/**
 * example-ext.js — An example extension demonstrating common block patterns.
 */

(function (Scratch) {
  const {
    vm, // Note: in Gandi, vm is not fully available for now (only used to access vm.runtime for compatibility reasons)
    runtime,
    ArgumentType,
    BlockType,
    TargetType,
    Cast,
    translate,
    extensions,
  } = Scratch;
  class ExampleExtension {
    constructor(_runtime) {
      this._runtime = _runtime;
    }
    getInfo() {
      return {
        id: 'exampleExtension',
        name: "ArgumentType测试",
        color1: '#FF8C1A',
        color2: '#DB6E00',

        blocks: [
          // ─── Command: move to random position ──────────────────
          {
            opcode: 'angle',
            blockType: BlockType.COMMAND,
            text: "angle [ANGLE]",
            arguments: {
              ANGLE: {
                type: ArgumentType.ANGLE
              }
            }
          },
          {
            opcode: 'boolean',
            blockType: BlockType.COMMAND,
            text: "boolean [BOOLEAN]",
            arguments: {
              BOOLEAN: {
                type: ArgumentType.BOOLEAN
              }
            }
          },
          {
            opcode: 'ccwHatParameter',
            blockType: BlockType.COMMAND,
            text: "ccw_hat_parameter [CCW_HAT_PARAMETER]",
            arguments: {
              CCW_HAT_PARAMETER: {
                type: ArgumentType.CCW_HAT_PARAMETER
              }
            }
          },
          {
            opcode: 'color',
            blockType: BlockType.COMMAND,
            text: "color [COLOR]",
            arguments: {
              COLOR: {
                type: ArgumentType.COLOR
              }
            }
          },
          {
            opcode: 'costume',
            blockType: BlockType.COMMAND,
            text: "costume [COSTUME]",
            arguments: {
              COSTUME: {
                type: ArgumentType.COSTUME
              }
            }
          },
          {
            opcode: 'image',
            blockType: BlockType.COMMAND,
            text: "image [IMAGE]",
            arguments: {
              IMAGE: {
                type: ArgumentType.IMAGE
              }
            }
          },
          {
            opcode: 'matrix',
            blockType: BlockType.COMMAND,
            text: "matrix [MATRIX]",
            arguments: {
              MATRIX: {
                type: ArgumentType.MATRIX
              }
            }
          },
          {
            opcode: 'note',
            blockType: BlockType.COMMAND,
            text: "note [NOTE]",
            arguments: {
              NOTE: {
                type: ArgumentType.NOTE
              }
            }
          },
          {
            opcode: 'number',
            blockType: BlockType.COMMAND,
            text: "number [NUMBER]",
            arguments: {
              NUMBER: {
                type: ArgumentType.NUMBER
              }
            }
          },
          {
            opcode: 'sound',
            blockType: BlockType.COMMAND,
            text: "sound [SOUND]",
            arguments: {
              SOUND: {
                type: ArgumentType.SOUND
              }
            }
          },
          {
            opcode: 'string',
            blockType: BlockType.COMMAND,
            text: "string [STRING]",
            arguments: {
              STRING: {
                type: ArgumentType.STRING
              }
            }
          },
          {
            opcode: 'xiguaMatrix',
            blockType: BlockType.COMMAND,
            text: "xiguaMatrix [XIGUA_MATRIX]",
            arguments: {
              XIGUA_MATRIX: {
                type: ArgumentType.XIGUA_MATRIX
              }
            }
          },
          {
            opcode: 'xiguaWhiteBoardNote',
            blockType: BlockType.COMMAND,
            text: "xiguaWhiteBoardNote [XIGUA_WHITE_BOARD_NOTE]",
            arguments: {
              XIGUA_WHITE_BOARD_NOTE: {
                type: ArgumentType.XIGUA_WHITE_BOARD_NOTE
              }
            }
          },
        ],
      };
    }
    angle (args) {
      console.log(args.ANGLE);
    }
    boolean (args) {
      console.log(args.BOOLEAN);
    }
    ccwHatParameter (args) {
      console.log(args.CCW_HAT_PARAMETER);
    }
    color (args) {
      console.log(args.COLOR);
    }
    costume (args) {
      console.log(args.COSTUME);
    }
    image (args) {
      console.log(args.IMAGE);
    }
    matrix (args) {
      console.log(args.MATRIX);
    }
    note (args) {
      console.log(args.NOTE);
    }
    number (args) {
      console.log(args.NUMBER);
    }
    sound (args) {
      console.log(args.SOUND);
    }
    string (args) {
      console.log(args.STRING);
    }
    xiguaMatrix (args) {
      console.log(args.XIGUA_MATRIX);
    }
    xiguaWhiteBoardNote (args) {
      console.log(args.XIGUA_WHITE_BOARD_NOTE);
    }

  }

  // ------------------------------------------------------------------
  // 6. Register
  // ------------------------------------------------------------------
  extensions.register(new ExampleExtension(runtime));
})(Scratch);
