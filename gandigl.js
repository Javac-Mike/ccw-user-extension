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

      'javac.ggl.block.gl.createProgram': '(program) [NAME] = glCreateProgram()',
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

      'javac.ggl.block.glu.compileShader': '(shader) [NAME] = gluCompileShader( (source) [SOURCE], (type) [TYPE] )',

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
    shaders = {};
    programs = {};
    shaderAttributes = {};
    buffers = {};
    compileSuccess = false;
    selectUsingType = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array]
    programArgument = {type: ArgumentType.STRING, defaultValue: "program"};
    shaderArgument  = {type: ArgumentType.STRING, defaultValue: "vertex_shader"};
    attribArgument  = {type: ArgumentType.STRING, defaultValue: "aPosition"};
    bufferArgument  = {type: ArgumentType.STRING, defaultValue: "buffer"};

    vsSource = `#version 300 es
precision highp float;
in vec3 aPosition;
in vec3 aColor;
uniform mat4 uMVP;
out vec3 vColor;
void main() {
  gl_Position = uMVP * vec4(aPosition, 1.0);
  vColor = aColor;
}`;
    fsSource = `#version 300 es
precision highp float;
in vec3 vColor;
out vec4 fragColor;
void main() {
  fragColor = vec4(vColor, 1.0);
}`;

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
              this.glEnabled = this.gl ? true : false;/*
              if (this.glEnabled) {
                this.gl.viewport(0, 0, this.stageCanvas.width, this.stageCanvas.height);
                const observer = new MutationObserver((mutationList) => {
                  for (const mutation of mutationList) {
                    if (mutation.attributeName === 'width' || mutation.attributeName === 'height') {
                      gl.viewport(0, 0, this.stageCanvas.width, this.stageCanvas.height);
                    }
                  }
                });
                observer.observe(this.stageCanvas, {attributes: true, attributeFilter: ['width', 'height']});
              }*/
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

          this.spi('javac.ggl.tag.gl'),
          this.makeBlock(
            'glCreateProgram',
            BlockType.COMMAND,
            'javac.ggl.block.gl.createProgram',
            {
              NAME: this.programArgument
            },
            null,
            ({ NAME }) => {
              this.programs[Cast.toString(NAME)] = this.gl.createProgram();
              console.log(this.programs);
            }
          ),
          this.makeBlock(
            'glAttachShader',
            BlockType.COMMAND,
            'javac.ggl.block.gl.attachShader',
            {
              PROGRAM: this.programArgument,
              SHADER: this.shaderArgument
            },
            null,
            ({ PROGRAM, SHADER }) => {
              const program = this.getProgram(PROGRAM);
              const shader = this.getShader(SHADER);
              this.gl.attachShader(program, shader);
              console.log(program);
              console.log(shader);
            }
          ),
          this.makeBlock(
            'glLinkProgram',
            BlockType.COMMAND,
            'javac.ggl.block.gl.linkProgram',
            {
              PROGRAM: this.programArgument
            },
            null,
            ({ PROGRAM }) => {
              const program = this.getProgram(PROGRAM);
              this.gl.linkProgram(program);
              console.log(program);
            }
          ),
          this.makeBlock(
            "glGetAttribLocation",
            BlockType.COMMAND,
            'javac.ggl.block.gl.getAttribLocation',
            {
              NAME: this.attribArgument,
              PROGRAM: this.programArgument,
              ATTRIBUTE: this.attribArgument
            },
            null,
            ({ PROGRAM, ATTRIBUTE, NAME }) => {
              const program = this.getProgram(PROGRAM);
              const attribute = Cast.toString(ATTRIBUTE);
              const name = Cast.toString(NAME);
              this.shaderAttributes[name] = this.gl.getAttribLocation(program, attribute);
            }
          ),
          this.makeBlock(
            "glGetUniformLocation",
            BlockType.COMMAND,
            'javac.ggl.block.gl.getUniformLocation',
            {
              NAME: this.attribArgument,
              PROGRAM: this.programArgument,
              ATTRIBUTE: this.attribArgument
            },
            null,
            ({ NAME, PROGRAM, ATTRIBUTE }) => {
              const program = this.getProgram(PROGRAM);
              const attribute = Cast.toString(ATTRIBUTE);
              const name = Cast.toString(NAME);
              this.shaderAttributes[name] = this.gl.getUniformLocation(program, attribute);
            }
          ),
          this.makeBlock(
            "glCreateBuffer",
            BlockType.COMMAND,
            'javac.ggl.block.gl.createBuffer',
            {
              NAME: this.bufferArgument
            },
            null,
            ({ NAME }) => {
              const name = Cast.toString(NAME);
              this.buffers[name] = this.gl.createBuffer();
            }
          ),
          this.makeBlock(
            "glBindBuffer",
            BlockType.COMMAND,
            'javac.ggl.block.gl.bindBuffer',
            {
              TYPE: {
                type: ArgumentType.NUMBER,
                menu: "BUFFER_ARRAY_TYPE"
              },
              BUFFER: this.bufferArgument
            },
            null,
            ({ TYPE, BUFFER }) => {
              const type = Cast.toNumber(TYPE);
              const buffer = this.getBuffer(BUFFER);
              this.gl.bindBuffer(type, buffer);
            }
          ),
          this.makeBlock(
            "glBufferData",
            BlockType.COMMAND,
            'javac.ggl.block.gl.bufferData',
            {
              TYPE: {
                type: ArgumentType.NUMBER,
                menu: "BUFFER_ARRAY_TYPE"
              },
              ARRAY: {
                type: ArgumentType.STRING,
                menu: "LIST_MENU"
              },
              DRAW_TYPE: {
                type: ArgumentType.NUMBER,
                menu: "BUFFER_DRAW_TYPE"
              },
              USING_TYPE: {
                type: ArgumentType.NUMBER,
                menu: "TYPED_ARRAY_TYPE"
              }
            }, null, (args, util) => {
              const type = Cast.toNumber(args.TYPE);
              const array = this.getScratchListValue(args.ARRAY, util);
              const dt = Cast.toNumber(args.DRAW_TYPE);
              // 把array转化为TypedArray方便传输
              const ut = Cast.toNumber(args.USING_TYPE);
              const t = this.selectUsingType[ut];
              const typedArray = new t(array);
              this.gl.bufferData(type, typedArray, dt);
            }
          ),
          this.makeBlock(
            'glUseProgram',
            BlockType.COMMAND,
            'javac.ggl.block.gl.useProgram',
            {
              PROGRAM: this.programArgument
            },
            null,
            ({ PROGRAM }) => {
              const program = this.getProgram(PROGRAM);
              this.gl.useProgram(program);
            }
          ),
          this.makeBlock(
            'glEnableVertexAttribArray',
            BlockType.COMMAND,
            'javac.ggl.block.gl.enableVertexAttribArray',
            {
              ATTRIBUTE: this.attribArgument
            },
            null,
            ({ ATTRIBUTE }) => {
              const attrib = this.getShaderAttribute(ATTRIBUTE);
              this.gl.enableVertexAttribArray(attrib);
            }
          ),
          this.makeBlock(
            'glVertexAttribPointer',
            BlockType.COMMAND,
            'javac.ggl.block.gl.vertexAttribPointer',
            {
              ATTRIBUTE: this.attribArgument,
              SIZE: {type: ArgumentType.NUMBER, defaultValue: 3},
              TYPE: {type: ArgumentType.NUMBER, menu: "GL_VERTEX_ATTRIB_POINTER_TYPE"},
              NORMALIZED: {type: ArgumentType.BOOLEAN, menu: "BOOL"},
              STRIDE: {type: ArgumentType.NUMBER, defaultValue: 24},
              OFFSET: {type: ArgumentType.NUMBER, defaultValue: 0}
            },
            null,
            ({ ATTRIBUTE, SIZE, TYPE, NORMALIZED, STRIDE, OFFSET }) => {
              const attribute = this.getShaderAttribute(ATTRIBUTE);
              const size = Cast.toNumber(SIZE);
              const type = Cast.toNumber(TYPE);
              const normalized = Cast.toBoolean(NORMALIZED);
              const stride = Cast.toNumber(STRIDE);
              const offset = Cast.toNumber(OFFSET);
              this.gl.vertexAttribPointer(attribute, size, type, normalized, stride, offset);
            }
          ),
          this.makeBlock(
            'glEnable',
            BlockType.COMMAND,
            'javac.ggl.block.gl.enable',
            {
              ENABLE: {type: ArgumentType.NUMBER, menu: "GL_ENABLE"}
            },
            null,
            ({ ENABLE }) => {
              this.gl.enable(Cast.toNumber(ENABLE));
            }
          ),
          this.makeBlock(
            'glDepthFunc',
            BlockType.COMMAND,
            'javac.ggl.block.gl.depthFunc',
            {
              FUNC: {type: ArgumentType.NUMBER, menu: "DEPTH_FUNC"}
            },
            null,
            ({ FUNC }) => {
              this.gl.depthFunc(Cast.toNumber(FUNC));
            }
          ),
          this.makeBlock(
            'glClearColor',
            BlockType.COMMAND,
            'javac.ggl.block.gl.clearColor',
            {
              R: {type: ArgumentType.NUMBER, defaultValue: 0.1},
              G: {type: ArgumentType.NUMBER, defaultValue: 0.1},
              B: {type: ArgumentType.NUMBER, defaultValue: 0.5},
              A: {type: ArgumentType.NUMBER, defaultValue: 1.0}
            },
            null,
            ({ R, G, B, A }) => {
              const r = Cast.toNumber(R);
              const g = Cast.toNumber(G);
              const b = Cast.toNumber(B);
              const a = Cast.toNumber(A);
              this.gl.clearColor(r, g, b, a);
            }
          ),
          this.makeBlock(
            'glUniformMatrix4fv',
            BlockType.COMMAND,
            'javac.ggl.block.gl.uniformMatrix4fv',
            {
              UNIFORM: {type: ArgumentType.STRING, defaultValue: 'uMVP'},
              LIST: {type: ArgumentType.STRING, menu: "LIST_MENU"}
            },
            null,
            ({ UNIFORM, LIST }, util) => {
              const uniform = this.getShaderAttribute(UNIFORM);
              const list = this.getScratchListValue(LIST, util);
              const mvp = new Float32Array(list);
              console.log(uniform);
              this.gl.uniformMatrix4fv(uniform, false, mvp);
            }
          ),
          this.makeBlock(
            'glClear',
            BlockType.COMMAND,
            'javac.ggl.block.gl.clear',
            {
              BIT: {type: ArgumentType.NUMBER, defaultValue: 16640}
            },
            null,
            ({ BIT }) => {
              this.gl.clear(Cast.toNumber(BIT));
            }
          ),
          this.makeBlock(
            'glDrawArrays',
            BlockType.COMMAND,
            'javac.ggl.block.gl.drawArrays',
            {
              MODE: {type: ArgumentType.NUMBER, menu: "DRAW_ARRAYS_MODE"},
              FIRST: {type: ArgumentType.NUMBER, defaultValue: 0},
              COUNT: {type: ArgumentType.NUMBER, defaultValue: 36},
            },
            null,
            ({ MODE, FIRST, COUNT }) => {
              this.gl.drawArrays(
                Cast.toNumber(MODE),
                Cast.toNumber(FIRST),
                Cast.toNumber(COUNT)
              );
            }
          ),

          this.spi('javac.ggl.tag.glu'),
          this.makeBlock(
            'gluCompileShader',
            BlockType.COMMAND,
            'javac.ggl.block.glu.compileShader',
            {
              NAME: this.shaderArgument,
              SOURCE: {
                type: ArgumentType.STRING,
                defaultValue: ""
              },
              TYPE: {
                type: ArgumentType.NUMBER,
                menu: "COMPILE_SHADER_TYPE"
              }
            }, null, ({NAME, SOURCE, TYPE}) => {
              const type = Cast.toNumber(TYPE);
              const name = Cast.toString(NAME);
              const source = Cast.toString(SOURCE);
              const shader = this.gl.createShader(type);
              this.gl.shaderSource(shader, source);
              this.gl.compileShader(shader);
              if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                this.gl.deleteShader(shader);
                this.compileSuccess = false;
                return;
              }
              this.compileSuccess = true;
              this.shaders[name] = shader;
            }
          ),

          this.spi('javac.ggl.tag.matrix'),
          this.makeBlock(
            'mat4Perspective',
            BlockType.COMMAND,
            'javac.ggl.block.matrix.mat4Perspective',
            {
              FOV: {
                type: ArgumentType.NUMBER,
                defaultValue: 70
              },
              ASPECT: {
                type: ArgumentType.NUMBER,
                defaultValue: 16/9
              },
              NEAR: {
                type: ArgumentType.NUMBER,
                defaultValue: 0.1
              },
              FAR: {
                type: ArgumentType.NUMBER,
                defaultValue: 100
              },
              LIST: {
                type: ArgumentType.STRING,
                menu: "LIST_MENU"
              }
            },
            null,
            ({ FOV, ASPECT, NEAR, FAR, LIST }, util) => {
              const fov = Math.PI / 180 * Cast.toNumber(FOV);
              const aspect = Cast.toNumber(ASPECT);
              const near = Cast.toNumber(NEAR);
              const far = Cast.toNumber(FAR);
              const f = 1.0 / Math.tan(fov / 2);
              const perspectiveMatrix = [
                f / aspect, 0, 0,                                0,
                0,          f, 0,                                0,
                0,          0, -(far + near) / (far - near),     -1,
                0,          0, -(2 * far * near) / (far - near), 0
              ];  // 因为 Scratch 不支持 Float32Array（TypedArray），所以用普通的 Number[] 传输，到时候传递 MVP 的时候再转化成 Float32Array
              this.setScratchListValue(Cast.toString(LIST), perspectiveMatrix, util);
            }
          ),
          this.makeBlock(
            'mat4LookAt',
            BlockType.COMMAND,
            'javac.ggl.block.matrix.mat4LookAt',
            {
              EX: {type: ArgumentType.NUMBER, defaultValue: 5},
              EY: {type: ArgumentType.NUMBER, defaultValue: 5},
              EZ: {type: ArgumentType.NUMBER, defaultValue: 5},
              CX: {type: ArgumentType.NUMBER, defaultValue: 0},
              CY: {type: ArgumentType.NUMBER, defaultValue: 0},
              CZ: {type: ArgumentType.NUMBER, defaultValue: 0},
              UX: {type: ArgumentType.NUMBER, defaultValue: 0},
              UY: {type: ArgumentType.NUMBER, defaultValue: 1},
              UZ: {type: ArgumentType.NUMBER, defaultValue: 0},
              LIST: {type: ArgumentType.STRING, menu: "LIST_MENU"}
            },
            null,
            ({ EX, EY, EZ, CX, CY, CZ, UX, UY, UZ, LIST }, util) => {
              const ex = Cast.toNumber(EX);
              const ey = Cast.toNumber(EY);
              const ez = Cast.toNumber(EZ);
              const ux = Cast.toNumber(UX);
              const uy = Cast.toNumber(UY);
              const uz = Cast.toNumber(UZ);
              const cx = Cast.toNumber(CX);
              const cy = Cast.toNumber(CY);
              const cz = Cast.toNumber(CZ);
              // 计算前向量 (forward) = normalize(center - eye)
              let fx = cx - ex,
                  fy = cy - ey,
                  fz = cz - ez;
              const flen = Math.sqrt(fx * fx + fy * fy + fz * fz);
              fx /= flen;
              fy /= flen;
              fz /= flen;

              // 计算右向量 (right) = normalize(cross(forward, up))
              let rx = fy * uz - fz * uy;
              let ry = fz * ux - fx * uz;
              let rz = fx * uy - fy * ux;
              const rlen = Math.sqrt(rx * rx + ry * ry + rz * rz);
              rx /= rlen;
              ry /= rlen;
              rz /= rlen;

              // 重新计算上向量 (up') = cross(right, forward)
              let ux_ = ry * fz - rz * fy;
              let uy_ = rz * fx - rx * fz;
              let uz_ = rx * fy - ry * fx;

              const lookAtMatrix = [
                rx,                             ux_,                               -fx,                           0,
                ry,                             uy_,                               -fy,                           0,
                rz,                             uz_,                               -fz,                           0,
                -(rx * ex + ry * ey + rz * ez), -(ux_ * ex + uy_ * ey + uz_ * ez), (fx * ex + fy * ey + fz * ez), 1
              ];
              this.setScratchListValue(LIST, lookAtMatrix, util);
            }
          ),
          this.makeBlock(
            'mat4Multiply',
            BlockType.COMMAND,
            'javac.ggl.block.matrix.mat4Multiply',
            {
              AL: {type: ArgumentType.STRING, menu: "LIST_MENU"},
              BL: {type: ArgumentType.STRING, menu: "LIST_MENU"},
              LIST: {type: ArgumentType.STRING, menu: "LIST_MENU"},
            },
            null,
            ({ AL, BL, LIST }, util) => {
              const a = this.getScratchListValue(AL, util);
              const b = this.getScratchListValue(BL, util);
              const result = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
              // 遍历每一列 (col) 和每一行 (row)
              for (let col = 0; col < 4; col++) {
                for (let row = 0; row < 4; row++) {
                  let sum = 0;
                  for (let k = 0; k < 4; k++) {
                    // 列主序存储：元素索引 = row + col * 4
                    sum += a[row + k * 4] * b[k + col * 4];
                  }
                  result[row + col * 4] = sum;
                }
              }
              this.setScratchListValue(LIST, result, util);
            }
          ),
          this.makeBlock(
            'mat4RotationX',
            BlockType.COMMAND,
            'javac.ggl.block.matrix.mat4RotationX',
            {
              ANGLE: {type: ArgumentType.NUMBER, defaultValue: 11.4514},
              LIST: {type: ArgumentType.STRING, menu: "LIST_MENU"}
            },
            null,
            ({ ANGLE, LIST }, util) => {
              const angle = Cast.toNumber(ANGLE);
              const c = Math.cos(angle);
              const s = Math.sin(angle);
              const matrix = [
                1, 0, 0, 0,   //|**************************|
                0, c, s, 0,   //| It's beautiful, isn't it?|
                0, -s, c, 0,  //|      这很漂亮，不是吗？     |
                0, 0, 0, 1    //|**************************|
              ];
              this.setScratchListValue(LIST, matrix, util);
            }
          ),
          this.makeBlock(
            'mat4RotationY',
            BlockType.COMMAND,
            'javac.ggl.block.matrix.mat4RotationY',
            {
              ANGLE: {type: ArgumentType.NUMBER, defaultValue: 11.4514},
              LIST: {type: ArgumentType.STRING, menu: "LIST_MENU"}
            },
            null,
            ({ ANGLE, LIST }, util) => {
              const angle = Cast.toNumber(ANGLE);
              const c = Math.cos(angle);
              const s = Math.sin(angle);
              const matrix = [
                c, 0, -s, 0,
                0, 1, 0, 0,
                s, 0, c, 0,
                0, 0, 0, 1
              ];
              this.setScratchListValue(LIST, matrix, util);
            }
          ),
          this.makeBlock(
            'mat4RotationZ',
            BlockType.COMMAND,
            'javac.ggl.block.matrix.mat4RotationZ',
            {
              ANGLE: {type: ArgumentType.NUMBER, defaultValue: 11.4514},
              LIST: {type: ArgumentType.STRING, menu: "LIST_MENU"}
            },
            null,
            ({ ANGLE, LIST }, util) => {
              const angle = Cast.toNumber(ANGLE);
              const c = Math.cos(angle);
              const s = Math.sin(angle);
              const matrix = [
                c, s, 0, 0,
                -s, c, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
              ];
              this.setScratchListValue(LIST, matrix, util);
            }
          ),
          this.makeBlock(
            'lineBreak',
            BlockType.REPORTER,
            'javac.ggl.block.util.lineBreak',
            null,
            null,
            () => '\n'
          ),
          this.makeBlock(
            'glConstant',
            BlockType.REPORTER,
            'javac.ggl.block.util.constant',
            {
              GL_CONSTANT: {type: ArgumentType.NUMBER, menu: "GL_CONSTANT"}
            },
            null,
            ({ GL_CONSTANT }) => Cast.toNumber(GL_CONSTANT)
          ),
        ];
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

    getInfo() {
      return {
        id: 'javac.ggl',
        name: 'GandiGL',
        color1: '#FF8C1A',
        color2: '#DB6E00',

        menus: {
          GL_CONSTANT: [
            {
              text: "GL_DEPTH_BUFFER_BIT",
              value: 256
            },
            {
              text: "GL_COLOR_BUFFER_BIT",
              value: 16384
            }
          ],
          BOOL:[
            {
              text: "true",
              value: true
            },
            {
              text: "false",
              value: false
            }
          ],
          GL_VERTEX_ATTRIB_POINTER_TYPE: [
            {
              text: "FLOAT",
              value: 5126
            },
            {
              text: "BYTE",
              value: 5120
            },
            {
              text: "SHORT",
              value: 5122
            },
            {
              text: "UNSIGNED_BYTE",
              value: 5121
            },
            {
              text: "UNSIGNED_SHORT",
              value: 5123
            }
          ],
          COMPILE_SHADER_TYPE: [
            {
              text: "GL_VERTEX_SHADER",
              value: 35633 // 由于初始this.gl=null，所以提前把常量的值先弄过来
            },
            {
              text: "GL_FRAGMENT_SHADER",
              value: 35632
            }
          ],
          BUFFER_DRAW_TYPE: [
            {
              text: "GL_STATIC_DRAW",
              value: 35044
            },
            {
              text: "GL_DYNAMIC_DRAW",
              value: 35048
            }
          ],
          BUFFER_ARRAY_TYPE: [
            {
              text: "GL_ARRAY_BUFFER",
              value: 34962
            }
          ],
          LIST_MENU: {
            acceptReporters: true,
            items: "listMenu",
          },
          TYPED_ARRAY_TYPE: [
            {
              text: "Int8 (-128~127)",
              value: 0
            },
            {
              text: "Uint8 (0~255)",
              value: 1
            },
            {
              text: "Int16 (-32768~32767)",
              value: 2
            },
            {
              text: "Uint16 (0~65535)",
              value: 3
            },
            {
              text: "Int32 (-2147483648~2147483647)",
              value: 4
            },
            {
              text: "Uint32 (0~4294967295)",
              value: 5
            },
            {
              text: "Float32",
              value: 6
            },
            {
              text: "Float64",
              value: 7
            }
          ],
          GL_ENABLE: [
            {
              text: "GL_DEPTH_TEST",
              value: 2929
            }
          ],
          DEPTH_FUNC: [
            {
              text: "GL_LESS",
              value: 513
            }
          ],
          DRAW_ARRAYS_MODE: [
            {
              text: "GL_TRIANGLES",
              value: 4
            }
          ]
        },

        blocks: this.blocks
      };
    }
  }
  extensions.register(new GandiGL(runtime));
})(Scratch);