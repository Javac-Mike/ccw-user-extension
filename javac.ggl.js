// Written by Javac

(function (_Scratch) {
  const {ArgumentType, BlockType, TargetType, Cast, translate, extensions, runtime} = _Scratch;

  translate.setup({
    zh: {
      'javac.ggl.tag.init': '初始化',
      'javac.ggl.tag.shader': '着色器',
      'javac.ggl.tag.gl': 'GL',
      'javac.ggl.tag.glu': 'GLU',
      'javac.ggl.tag.matrix': '矩阵工具',
      'javac.ggl.tag.util': '实用工具',

      'javac.ggl.block.init.initWebGL': '初始化 WebGL 渲染器',
      'javac.ggl.block.init.isGLEnabled': '当前浏览器是否支持 WebGL ',

      'javac.ggl.block.shader.dvss': '默认顶点着色器源码',
      'javac.ggl.block.shader.dfss': '默认片段着色器源码',
      'javac.ggl.block.shader.fromGLSL': '来自 GLSL 文件 [FILE]',
      'javac.ggl.block.shader.compileShader': '编译着色器，源码(source) [SOURCE], 类型(type) [TYPE]',

      'javac.ggl.block.gl.createProgram': 'glCreateProgram()',
      'javac.ggl.block.gl.attachShader': 'glAttachShader( (program) [PROGRAM], (shader) [SHADER] )',
      'javac.ggl.block.gl.linkProgram': 'glLinkProgram( (program) [PROGRAM] )',
      'javac.ggl.block.gl.getAttribLocation': '(attribute) [NAME] = glGetAttribLocation( (program) [PROGRAM], (attrName) [ATTRIBUTE])',
      'javac.ggl.block.gl.getUniformLocation': '(attribute) [NAME] = glGetUniformLocation( (program) [PROGRAM], (attrName) [ATTRIBUTE])',
      'javac.ggl.block.gl.createBuffer': '(buffer) [NAME] = glCreateBuffer()',
      'javac.ggl.block.gl.bindBuffer': 'glBindBuffer( (arrayType) [TYPE], (buffer) [BUFFER] )',
      'javac.ggl.block.gl.bufferData': 'glBufferData( (arrayType) [TYPE], (array) [ARRAY], (type) [DRAW_TYPE] ) (把array转化为类型为 [USING_TYPE] 传输)',
      'javac.ggl.block.gl.useProgram': 'glUseProgram( (program) [PROGRAM] )',
      'javac.ggl.block.gl.vertexAttribPointer': 'glVertexAttribPointer( (attribute) [ATTRIBUTE], (size) [SIZE], (type) [TYPE], (normalized) [NORMALIZED], (stride) [STRIDE], (offset) [OFFSET] )',
      'javac.ggl.block.gl.enableVertexAttribArray': 'glEnableVertexAttribArray( (attribute) [ATTRIBUTE] )',
      'javac.ggl.block.gl.enable': 'glEnable( [ENABLE] )',
      'javac.ggl.block.gl.depthFunc': 'glDepthFunc( [FUNC] )',
      'javac.ggl.block.gl.clearColor': 'glClearColor( (r) [R], (g) [G], (b) [B], (a) [A] )',
      'javac.ggl.block.gl.uniformMatrix4fv': 'glUniformMatrix4fv( (attribute) [UNIFORM], (transpose) FALSE, (matrix) [LIST] )',
      'javac.ggl.block.gl.clear': 'glClear( [BIT] )',
      'javac.ggl.block.gl.drawArrays': 'glDrawArrays( (mode) [MODE], (first) [FIRST], (count) [COUNT] )',


      'javac.ggl.block.matrix.mat4Perspective': '构建透视矩阵，视角(FOV) [FOV], 宽高比（舞台长除以宽）(aspect) [ASPECT], 近平面(near) [NEAR], 远平面(far) [FAR]，矩阵按列主序储存到列表 [LIST] 中',
      'javac.ggl.block.matrix.mat4LookAt': '用 LookAt 构建视图矩阵，摄像机位置 (x: [EX] y: [EY], z: [EZ]), 看向目标点 (x: [CX], y: [CY], z: [CZ]), 世界坐标系上方向(x: [UX], y: [UY], z: [UZ])，矩阵按列主序储存在列表 [LIST] 中',
      'javac.ggl.block.matrix.mat4Multiply': '4x4矩阵（列主序储存）[AL] * [BL]，结果写入列表 [LIST]',
      'javac.ggl.block.matrix.mat4RotationX': '4x4矩阵（列主序）绕 X 轴旋转矩阵，角度 [ANGLE]，结果写入列表 [LIST]',
      'javac.ggl.block.matrix.mat4RotationY': '4x4矩阵（列主序）绕 Y 轴旋转矩阵，角度 [ANGLE]，结果写入列表 [LIST]',
      'javac.ggl.block.matrix.mat4RotationZ': '4x4矩阵（列主序）绕 Z 轴旋转矩阵，角度 [ANGLE]，结果写入列表 [LIST]',

      'javac.ggl.block.util.lineBreak': '换行符',
      'javac.ggl.block.util.constant': 'OpenGL 常数 [GL_CONSTANT]',
    }
  });

  class GandiGL {
    stageCanvas;
    gl;
    glEnabled = false;
    compileSuccess = false;
    selectUsingType = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array]
    programArgument = {type: ArgumentType.STRING, defaultValue: "program"};
    shaderArgument  = {type: ArgumentType.STRING, defaultValue: "vertex_shader"};
    attribArgument  = {type: ArgumentType.STRING, defaultValue: "aPosition"};
    bufferArgument  = {type: ArgumentType.STRING, defaultValue: "buffer"};

    vsSource = `#version 300 es
in vec3 aPosition;
in vec3 aColor;
uniform mat4 uMVP;
out vec3 vColor;
void main() {
  gl_Position = uMVP * vec4(aPosition, 1.0);
  vColor = aColor;
}`;
    fsSource = `#version 300 es
precision mediump float;
in vec3 vColor;
out vec4 fragColor;
void main() {
  fragColor = vec4(vColor, 1.0);
}`;

    getInfo() {
      return {
        id: 'javac.ggl',
        name: 'GandiGL',
        color1: '#FF8C1A',
        color2: '#DB6E00',

        blocks: this.blocks
      };
    }

    makeBlock(opcode, blockType, text_id, args, filter, func) {
      eval('this.'+opcode+'=func;');
      let block = {opcode, blockType, text: translate({id: text_id})};
      if (args) {
        block.arguments = args;
      }
      if (filter) {
        block.filter = filter;
      }
      return block;
    }

    spi(_id) {
      return '---'+translate({id:_id});
    }

    getProgram(name) {
      return this.programs[Cast.toString(name)];
    }

    getShader(name) {
      return this.shaders[Cast.toString(name)];
    }

    getShaderAttribute(name) {
      return this.shaderAttributes[Cast.toString(name)];
    }

    getBuffer(name) {
      return this.buffers[Cast.toString(name)];
    }

    get runtime() {
      return _Scratch.runtime;
    }

    Float32ArrayToList (array) {
      return [array[0],array[1],array[2],array[3],array[4],array[5],array[6],array[7],array[8],array[9],array[10],array[11],array[12],array[13],array[14],array[15]];
    }

    /** 感谢 Arkos */
    getScratchList(Name, util) {
      const name = Cast.toString(Name);
      if (name === "empty") return "";
      let list = util.target.lookupVariableById(name);
      if (!list) {
        list = util.target.lookupVariableByNameAndType(name, 'list');
        if (!list) return "";
      }
      return list;
    }

    getScratchListValue(name, util) {
      let list = this.getScratchList(name, util);
      if (!list) return [];
      return list.value;
    }

    setScratchListValue(name, obj, util) {
      let list = this.getScratchList(name, util);
      if (!list) return;
      list.value = obj;
    }
    /**
     * 感谢Arkos
     * @returns {text: "列表名", value: "列表id"}[];
     */
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


    constructor(_runtime) {
      this._runtime = _runtime;
      this.blocks = [
          this.spi('javac.ggl.tag.init'),
          this.makeBlock(
            'initWebGL',
            BlockType.COMMAND,
            'javac.ggl.block.init.initWebGL',
            null,
            null,
            () => {
              if (this.gl) {
                // WebGL在上一次被使用了，所以覆盖上下文，把program、shader、attribute字典清除
                for (const key in this.programs) {
                  this.gl.deleteProgram(this.programs[key]);
                }
                for (const key in this.shaders) {
                  this.gl.deleteShader(this.shaders[key]);
                }
                for (const key in this.buffers) {
                  this.gl.deleteBuffer(this.buffers[key]);
                }
                this.programs = {};
                this.shaders = {};
                this.shaderAttributes = {};
                this.buffers = {};
                this.compileSuccess = false;
                this.glEnabled = false;
              }
              this.stageCanvas = document.getElementsByClassName('ccw-stage-wrapper')[0].getElementsByTagName('div')[0].getElementsByTagName('canvas')[0];
              this.gl = this.stageCanvas.getContext('webgl2');
              this.glEnabled = this.gl ? true : false;
            }
          ),
          this.makeBlock(
            'isGLEnabled',
            BlockType.BOOLEAN,
            'javac.ggl.block.init.isGLEnabled',
            null,
            null,
            () => this.glEnabled
          ),

          this.spi('javac.ggl.tag.shader'),
          this.makeBlock(
            'defaultVertexShaderSource',
            BlockType.REPORTER,
            'javac.ggl.block.shader.dvss',
            null,
            null,
            () => this.vsSource
          ),
          this.makeBlock(
            'defaultFragmentShaderSource',
            BlockType.REPORTER,
            'javac.ggl.block.shader.dfss',
            null,
            null,
            () => this.fsSource
          ),
          this.makeBlock(
            'compileShader',
            blockType.REPORTER,
            'javac.ggl.block.shader.compileShader',
            {
              SOURCE: {type: ArgumentType.STRING, defaultValue: ""},
              TYPE: {type: ArgumentType.NUMBER, menu: "COMPILE_SHADER_TYPE"}
            },
            null,
            ({ SOURCE, TYPE }) => {
              const type = Cast.toNumber(TYPE);
              const source = Cast.toString(SOURCE);
              const shader = this.gl.createShader(type);
              this.gl.shaderSource(shader, source);
              this.gl.compileShader(shader);
              if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                this.gl.deleteShader(shader);
                return null;
              }
              return shader;
            }
          ),

          this.spi('javac.ggl.tag.gl'),
          this.makeBlock(
            'glCreateProgram',
            BlockType.REPORTER,
            'javac.ggl.block.gl.createProgram',
            null,
            null,
            () => this.gl.createProgram();
          ),
        ];
    }
  }
  extensions.register(new GandiGL(runtime));
})(Scratch);
