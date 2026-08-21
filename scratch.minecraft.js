(function (_Scratch){
  'use strict';
  const {ArgumentType, BlockType, Cast, translate, extension, runtime} = _Scratch;

  // Math
  class Vector3 {
    constructor (x, y, z) {
      if (x instanceof Vector3) {
        this.x = x.x;
        this.y = x.y;
        this.z = x.z;
        return;
      }
      if (x == undefined || y == undefined || z == undefined) throw new Error('Input Number is not a Number');
      this.x = Number(x);
      this.y = Number(y);
      this.z = Number(z);
      if (isNaN(this.x) || isNaN(this.y) || isNaN(this.z)) {
        throw new Error('Input Number is not a Number');
      }
    }

    _typeCheck (other) {if (other == null || !(other instanceof Vector3)) throw new Error('Input other is not instanceof Vector3');}

    add (other) {
      this._typeCheck(other);
      this.x += other.x;
      this.y += other.y;
      this.z += other.z;
      return this;
    }

    sub (other) {
      this._typeCheck(other);
      this.x -= other.x;
      this.y -= other.y;
      this.z -= other.z;
      return this;
    }

    mul (scalar) {
      const s = Number(scalar);
      if (isNaN(s)) throw new Error('Input Number is not a Number');
      this.x *= s;
      this.y *= s;
      this.z *= s;
      return this;
    }

    div (divisor) {
      const d = Number(divisor);
      if (isNaN(d)) throw new Error('Input Number is not a Number');
      if (d == 0) throw new Error('Input Number is 0');
      this.x /= d;
      this.y /= d;
      this.z /= d;
      return this;
    }

    length () {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    dot (other) {
      this._typeCheck(other);
      return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    negate () {
      return this.mul(-1);
    }

    toString () {
      return `Vector3 <x=${this.x}, y=${this.y}, z=${this.z}>`;
    }

    clone () {
      return new Vector3(this.x, this.y, this.z);
    }

    cross (other) {
      this._typeCheck(other);
      return new Vector3(
        this.y * other.z - this.z * other.y,
        this.z * other.x - this.x * other.z,
        this.x * other.y - this.y * other.x
      );
    }

    static zero () {
      return new Vector3(0, 0, 0);
    }

    static one () {
      return new Vector3(1, 1, 1);
    }

    static fromArray (arr) {
      if (arr.length < 3) throw new Error('Input Array length less than 3');
      return new Vector3(arr[0], arr[1], arr[2]);
    }
  }

  const matrix = {
    multiply (a, b) {
      return [
        [a[0][0]*b[0][0]+a[0][1]*b[1][0]+a[0][2]*b[2][0], a[0][0]*b[0][1]+a[0][1]*b[1][1]+a[0][2]*b[2][1], a[0][0]*b[0][2]+a[0][1]*b[1][2]+a[0][2]*b[2][2]],
        [a[1][0]*b[0][0]+a[1][1]*b[1][0]+a[1][2]*b[2][0], a[1][0]*b[0][1]+a[1][1]*b[1][1]+a[1][2]*b[2][1], a[1][0]*b[0][2]+a[1][1]*b[1][2]+a[1][2]*b[2][2]],
        [a[2][0]*b[0][0]+a[2][1]*b[1][0]+a[2][2]*b[2][0], a[2][0]*b[0][1]+a[2][1]*b[1][1]+a[2][2]*b[2][1], a[2][0]*b[0][2]+a[2][1]*b[1][2]+a[2][2]*b[2][2]],
      ];
    },
    radians (deg) {return deg * Math.PI / 180;},
    degrees (rad) {return rad * 180 / Math.PI;},
    yaw (angleDegrees) {
      const theta = matrix.radians(angleDegrees);
      const c = Math.cos(theta);
      const s = Math.sin(theta);
      return [
        [c, 0, -s],
        [0, 1, 0],
        [s, 0, c]
      ];
    },
    pitch (angleDegrees) {
      const theta = matrix.radians(angleDegrees);
      const c = Math.cos(theta);
      const s = Math.sin(theta);
      return [
        [1, 0,  0],
        [0, c,  s],
        [0, -s, c]
      ];
    },
    roll (angleDegrees) {
      const theta = matrix.radians(angleDegrees);
      const c = Math.cos(theta);
      const s = Math.sin(theta);
      return [
        [c, -s, 0],
        [s, c,  0],
        [0, 0,  1]
      ];
    },
    makeMatrix (yaw, pitch, roll) {
      return matrix.multiply(matrix.multiply(matrix.yaw(yaw), matrix.pitch(pitch)), matrix.roll(roll));
    },
    apply (m, v) {
      if (m == null) return v;
      return new Vector3(
        m[0][0]*v.x+m[0][1]*v.y+m[0][2]*v.z,
        m[1][0]*v.x+m[0][1]*v.y+m[0][2]*v.z,
        m[2][0]*v.x+m[0][1]*v.y+m[0][2]*v.z
      );
    }
  }

  // connection
  class Connection {
    constructor (host, port) {
      this.host = host ? host: 'localhost';
      this.port = port ? port: 14711;
      this.ws = new WebSocket(`ws://${this.host}:${this.port}`);
    }

    send (f, ...data) {
      this.ws.send(`${f}(${data.map(x=>x.toString()).join(',')})\n`);
    }

    receive () {
      return new Promise((resolve, reject) => {
        ws.onmessage = (event) => resolve(event.data.trim());
        ws.onerror = (err) => reject(err);
      });
    }

    sendReceive (f, ...data) {
      this.send(f, ...data);
      return this.receive();
    }
  }

  class CmdPositioner {
    constructor (conn, pkg) {
      this.conn = conn;
      this.pkg = pkg;
    }

    _sr (f, ...data) {
      return this.conn.sendReceive(`${this.pkg}.${f}`, ...data);
    }

    _s (f, ...data){
      this.conn.send(`${this.pkg}.${f}`, ...data);
    }

    getPitch (id) {
      return this._sr("getPitch", id).then(value => Number(value));
    }

    getRotation (id) {
      return this._sr("getRotation", id).then(value => Number(value));
    }

    getNameAndUUID (id) {
      return this._sr("getNameAndUUID", id).then(value => {
        const comma = value.lastIndexOf(',');
        return [value.substring(0, comma), value.substring(comma+1)];
      });
    }

    getDirection (id) {
      return this._sr("getDirection", id).then(value => new Vector3(...value.split(',').map(x=>Number(x))));
    }

    getPos (id) {
      return this._sr("getPos", id).then(value => new Vector3(...value.split(',').map(x=>Number(x))));
    }

    getTilePos (id) {
      return this._sr("getTile", id).then(value => new Vector3(...value.split(',').map(x=>Number(x))));
    }

    setPos (id, x, y, z) {
      this._s("setPos", id, x, y, z);
    }

    setDirection (id, xr, yr, zr) {
      this._s("setDirection", id, xr, yr, zr);
    }

    setRotation (id, angle) {
      this._s("setRotation", id, angle);
    }

    setPitch (id, angle) {
      this._s("setPitch", id, angle);
    }

    setTilePos (id, x, y, z) {
      this._s("setTile", id, x, y, z);
    }
  }

  class CmdPlayer extends CmdPositioner {
    constructor (conn) {
      super(conn, "player");
    }

    getPitch () {
      return this._sr("getPitch").then(value => Number(value));
    }

    getRotation () {
      return this._sr("getRotation").then(value => Number(value));
    }

    getNameAndUUID () {
      return this._sr("getNameAndUUID").then(value => {
        const comma = value.lastIndexOf(',');
        return [value.substring(0, comma), value.substring(comma+1)];
      });
    }

    getDirection () {
      return this._sr("getDirection").then(value => new Vector3(...value.split(',').map(x=>Number(x))));
    }

    getPos () {
      return this._sr("getPos").then(value => new Vector3(...value.split(',').map(x=>Number(x))));
    }

    getTilePos () {
      return this._sr("getTile").then(value => new Vector3(...value.split(',').map(x=>Number(x))));
    }

    setPos (x, y, z) {
      this._s("setPos", x, y, z);
    }

    setDirection (xr, yr, zr) {
      this._s("setDirection", xr, yr, zr);
    }

    setRotation (angle) {
      this._s("setRotation", angle);
    }

    setPitch (angle) {
      this._s("setPitch", angle);
    }

    setTilePos (x, y, z) {
      this._s("setTile", x, y, z);
    }

    postToChat (...msg) {
      this.conn.send("player.chat.post", "", msg.map(x=>x.toString().replace("\r"," ").replace("\n"," ")).join(" "));
    }
  }

  class CmdEntity extends CmdPositioner{
    constructor (conn) {
      super(conn, "entity");
    }
  }

  class CmdCamera {
    constructor (conn) {
      this.conn = conn;
    }

    setNormal (id) {
      this.conn.send("camera.mode.setNormal", id);
    }

    setFollow (id) {
      this.conn.send("camera.mode.setFollow", id);
    }
  }

  class Minecraft {
    constructor (host, port) {
      this.conn = new Connection(host, port);
      this.camera = new CmdCamera(this.conn);
      this.entity = new CmdEntity(this.conn);
      this.player = new CmdPlayer(this.conn);
    }

    postToChat (...msg) {
      this.conn.send('chat.post', msg.join(' ').replace('\n', ' '));
    }

    spawnEntity (id, x, y, z) {
      return this.conn.sendReceive("world.spawnEntity", id, x, y, z).then(value => parseInt(Number(value)));
    }

    removeEntity (id) {
      this.conn.send("world.removeEntity", id);
    }

    getBlock (x, y, z) {
      return this.conn.sendReceive("world.getBlock", x, y, z).then(value => parseInt(Number(value)));
    }

    setBlock (x, y, z, id, data) {
      let value = data?[x, y, z, id, data]:[x, y, z, id];
      this.conn.send("world.setBlock", ...value);
    }

    setBlocks (x0, y0, z0, x1, y1, z1, id, data) {
      let value = data?[x0, y0, z0, x1, y1, z1, id, data]:[x0, y0, z0, x1, y1, z1, id];
      this.conn.send("world.setBlocks", ...value);
    }

    getHeight (x, z) {
      return this.conn.sendReceive("world.getHeight", x, z).then(value => parseInt(Number(value)));
    }

    getPlayerEntityIds () {
      return this.conn.sendReceive("world.getPlayerEntityIds").then(value => value.split("|").map(x=>parseInt(Number(x))));
    }

    setting (setting, status) {
      this.conn.send("world.setting", setting, Cast.toBoolean(status)*1);
    }
  }

  translate.setup({
    zh: {
      'javac.minecraft.tag.connect': '连接与初始化',
      'javac.minecraft.tag.chat': '聊天💬',
      'javac.minecraft.tag.block': '方块♦',
      'javac.minecraft.tag.entity': '实体🐖',
      'javac.minecraft.tag.player': '玩家',
      'javac.minecraft.tag.camera': '相机📷',
      'javac.minecraft.tag.vector': '3D向量工具🔨',
      'javac.minecraft.tag.turtle': '3D海龟绘图🐢',


      'javac.minecraft.block.connectMinecraft': '在主机 [HOST] 的 [PORT] 连接到 Minecraft',

      'javac.minecraft.block.postToChat': '向所有玩家广播 [MESSAGE] 消息',

      'javac.minecraft.block.setBlock': '在 [X], [Y], [Z] 处放置方块 [BLOCK]',
      'javac.minecraft.block.setBlocks': '在 [X0], [Y0], [Z0] 到 [X1], [Y1], [Z1] 之间放置方块 [BLOCK]',
      'javac.minecraft.block.getBlock': '获取位于 [X], [Y], [Z] 的方块ID',
      'javac.minecraft.block.getHeight': '获取 [X], [Z] 的最高位置',
      'javac.minecraft.block.getBlockId': '获取方块 [BLOCK] 的ID',

      'javac.minecraft.block.spawnEntity': '在 [X], [Y], [Z] 处生成一个实体 [ENTITY]',
      'javac.minecraft.block.spawnEntityReturns': '在 [X], [Y], [Z] 处生成一个实体 [ENTITY]，并获得实体ID',
      'javac.minecraft.block.removeEntity': '删除ID为 [ENTITY] 的实体',
      'javac.minecraft.block.getPitch': '获取实体 [ENTITY] 的俯仰角度',
      'javac.minecraft.block.getRotation': '获取实体 [ENTITY] 的偏航角度',
      'javac.minecraft.block.getNameAndUUID': '获取实体 [ENTITY] 的名字和UUID',
      'javac.minecraft.block.getDirection': '获取实体 [ENTITY] 的XYZ旋转',
      'javac.minecraft.block.getPos': '获取实体 [ENTITY] 的精确坐标',
      'javac.minecraft.block.getTilePos': '获取实体 [ENTITY] 的方块坐标',
      'javac.minecraft.block.setPos': '设置实体 [ENTITY] 的精确坐标为 [X], [Y], [Z]',
      'javac.minecraft.block.setTilePos': '设置实体 [ENTITY] 的方块坐标为 [X], [Y], [Z]',
      'javac.minecraft.block.setDirection': '设置实体 [ENTITY] 的XYZ旋转为 [X], [Y], [Z]',
      'javac.minecraft.block.setRotation': '设置实体 [ENTITY] 的偏航角度为 [YAW]',
      'javac.minecraft.block.setPitch': '设置实体 [ENTITY] 的俯仰角度为 [PITCH]',

      'javac.minecraft.block.playerGetDirection': '获取玩家的XYZ旋转',
      'javac.minecraft.block.playerGetPitch': '获取玩家的俯仰角度',
      'javac.minecraft.block.playerGetRotation': '获取玩家的偏航角度',
      'javac.minecraft.block.playerGetPos': '获取玩家的精确坐标',
      'javac.minecraft.block.playerGetTilePos': '获取玩家的方块坐标',
      'javac.minecraft.block.playerGetNameAndUUID': '获取玩家的名称和UUID',
      'javac.minecraft.block.playerSetDirection': '设置玩家的XYZ旋转为 [X], [Y], [Z]',
      'javac.minecraft.block.playerSetRotation': '设置玩家的偏航角度为 [YAW]',
      'javac.minecraft.block.playerSetPos': '设置玩家的精确坐标为 [X], [Y], [Z]',
      'javac.minecraft.block.playerSetTilePos': '设置玩家的方块坐标为 [X], [Y], [Z]',
      'javac.minecraft.block.playerSetPitch': '设置玩家的俯仰角度为 [PITCH]',

      // 'javac.minecraft.block.cameraSetNormal': '' // camera not support

      'javac.minecraft.block.newVector': '3D向量 ([X], [Y], [Z])',
      'javac.minecraft.block.vectorAdd': '3D向量 [A] + [B]',
      'javac.minecraft.block.vectorSub': '3D向量 [A] - [B]',
      'javac.minecraft.block.vectorMul': '3D向量 [A] * [SCALAR]',
      'javac.minecraft.block.vectorDiv': '3D向量 [A] / [DIVISOR]',
      'javac.minecraft.block.vectorLength': '3D向量 [VECTOR] 的长度',
      'javac.minecraft.block.vectorDot': '3D向量 [A] 与 [B] 的点积',
      'javac.minecraft.block.vectorNegate': '3D向量 - [VECTOR]',
      'javac.minecraft.block.vectorClone': '3D向量 [VECTOR] 克隆',
      'javac.minecraft.block.vectorCross': '3D向量 [A] 与 [B] 的向量叉积',
    }
  });

  class  Mineturtle {
    constructor () {}
  }

  class ScratchMinecraft {
    constructor (_runtime) {
      this.runtime = runtime;
      this.mc = null;
      this.blocks = [];
      this.menus = {};
      this.initBlocks();
      this.initMenus();
      this.info = {
        id: 'scratchMinecraft',
        name: 'Scratch Minecraft',
        color1: '#1ab4ff',
        color2: '#2900f6',
        blockIconURI: blockIconURI,
        blocks: this.blocks,
        menus: this.menus,
      };
    }

    fm (id) {return translate({id});}

    initBlocks () {
      const t = this;
      const makeBlock = (opcode, blockType, args, text, func) => {
        if (opcode && !blockType) {t.blocks.push(opcode);return;}
        ScratchMinecraft.prototype[opcode] = func;
        t.blocks.push({opcode, blockType, arguments: args, text});
      };

      // 连接
      makeBlock('---'+this.fm('javac.minecraft.tag.connect'));
      makeBlock(
          'connectMinecraft',
          BlockType.COMMAND,
          {
            HOST: { type: ArgumentType.STRING, defaultValue: 'localhost' },
            PORT: { type: ArgumentType.NUMBER, defaultValue: 14711 }
          },
          this.fm('javac.minecraft.block.connectMinecraft'),
          ({ HOST, PORT }) => {
            t.mc = new Minecraft(Cast.toString(HOST), Cast.toNumber(PORT));
          }
      );

      // 聊天
      makeBlock('---'+this.fm('javac.minecraft.tag.chat'));
      makeBlock(
          'postToChat',
          BlockType.COMMAND,
          {
            MESSAGE: { type: ArgumentType.STRING, defaultValue: 'Hello World!' },
          },
          this.fm('javac.minecraft.block.postToChat'),
          ({ MESSAGE }) => {
            t.mc.postToChat(MESSAGE);
          }
      );

      // 方块
      makeBlock('---'+this.fm('javac.minecraft.tag.block'));
      makeBlock(
          'setBlock',
          BlockType.COMMAND,
          {
            X: { type: ArgumentType.NUMBER, defaultValue: 0},
            Y: { type: ArgumentType.NUMBER, defaultValue: 0},
            Z: { type: ArgumentType.NUMBER, defaultValue: 0},
            BLOCK: { type: ArgumentType.STRING, menu: "BLOCKS"}
          },
          this.fm('javac.minecraft.block.setBlock'),
          ({ X, Y, Z, BLOCK }) => t.mc.setBlock
      )
      // 实体
      // 玩家
      // 相机
      // 向量
      // 绘图
    }

    getInfo () {
      return this.info;
    }
  }

})(Scratch);