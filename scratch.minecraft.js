(function (_Scratch) {
    'use strict';
    const {ArgumentType, BlockType, Cast, translate, extensions, runtime} = _Scratch;

    const blocks = {
        AIR: "0,0",
        STONE: "1,0",
        STONE_GRANITE: "1,1",
        STONE_DIORITE: "1,3",
        STONE_ANDESITE_SMOOTH: "1,6",
        GRASS: "2,0",
        DIRT: "3,0",
        DIRT_PODZOL: "3,2",
        WOOD_PLANKS_OAK: "5,0",
        WOOD_PLANKS_ACACIA: "5,4",
        WOOD_PLANKS_DARK_OAK: "5,5",
        SAPLING_SPRUCE: "6,1",
        SAPLING_ACACIA: "6,4",
        SAPLING_DARK_OAK: "6,5",
        BEDROCK: "7,0",
        WATER: "8,0",
        WATER_FLOWING: "8,0",
        LAVA_FLOWING: "10,0",
        RED_SAND: "12,1",
        IRON_ORE: "15,0",
        COAL_ORE: "16,0",
        JUNGLE_WOOD: "17,3",
        LEAVES: "18,0",
        LEAVES_ACACIA_PERMANENT: "18,4",
        LEAVES_OAK_PERMANENT: "18,4",
        LEAVES_SPRUCE_PERMANENT: "18,5",
        LEAVES_BIRCH_PERMANENT: "18,6",
        LEAVES_DARK_OAK_PERMANENT: "18,7",
        LEAVES_JUNGLE_PERMANENT: "18,7",
        SPONGE_WET: "19,1",
        GLASS: "20,0",
        LAPIS_LAZULI_BLOCK: "22,0",
        SANDSTONE: "24,0",
        SANDSTONE_SMOOTH: "24,2",
        BED_BLOCK: "26,0",
        RAIL_DETECTOR: "28,0",
        COBWEB: "30,0",
        GRASS_TALL: "31,0",
        FERN: "31,2",
        PISTON: "33,0",
        WOOL: "35,0",
        WOOL_BLUE: "35,11",
        WOOL_GREEN: "35,13",
        WOOL_RED: "35,14",
        WOOL_MAGENTA: "35,2",
        WOOL_YELLOW: "35,4",
        WOOL_PINK: "35,6",
        WOOL_LIGHT_GRAY: "35,8",
        WOOL_CYAN: "35,9",
        DANDELION: "37,0",
        FLOWER_YELLOW: "37,0",
        FLOWER_BLUE_ORCHID: "38,1",
        FLOWER_ALLIUM: "38,2",
        FLOWER_TULIP_RED: "38,4",
        FLOWER_TULIP_ORANGE: "38,5",
        FLOWER_OXEYE_DAISY: "38,8",
        MUSHROOM_BROWN: "39,0",
        GOLD_BLOCK: "41,0",
        STONE_SLAB: "44,0",
        TNT: "46,0",
        OBSIDIAN: "49,0",
        MOB_SPAWNER: "52,0",
        DIAMOND_BLOCK: "57,0",
        WHEAT: "59,0",
        FURNACE_ACTIVE: "62,0",
        DOOR_WOOD: "64,0",
        RAIL_NORMAL: "66,0",
        STAIRS_COBBLESTONE: "67,0",
        REDSTONE_ORE: "73,0",
        REDSTONE_TORCH_INACTIVE: "75,0",
        SNOW: "78,0",
        ICE: "79,0",
        CACTUS: "81,0",
        CLAY: "82,0",
        SUGAR_CANE: "83,0",
        FENCE: "85,0",
        PUMPKIN_INACTIVE: "86,0",
        SOUL_SAND: "88,0",
        PORTAL: "90,0",
        REDSTONE_REPEATER_INACTIVE: "93,0",
        STAINED_GLASS: "95,0",
        STAINED_GLASS_BLUE: "95,11",
        STAINED_GLASS_GREEN: "95,13",
        STAINED_GLASS_RED: "95,14",
        STAINED_GLASS_MAGENTA: "95,2",
        STAINED_GLASS_YELLOW: "95,4",
        STAINED_GLASS_PINK: "95,6",
        STAINED_GLASS_LIGHT_GRAY: "95,8",
        STAINED_GLASS_CYAN: "95,9",
        TRAPDOOR: "96,0",
        STONE_BRICK_MOSSY: "98,1",
        STONE_BRICK_CHISELED: "98,3",
        MUSHROOM_BLOCK_BROWN: "99,0",
        IRON_BARS: "101,0",
        MELON: "103,0",
        MYCELIUM: "110,0",
        NETHER_BRICK: "112,0",
        ENCHANTING_TABLE: "116,0",
        BREWING_STAND: "117,0",
        END_PORTAL_FRAME: "120,0",
        END_STONE: "121,0",
        DRAGON_EGG: "122,0",
        REDSTONE_LAMP_ACTIVE: "124,0",
        TRIPWIRE_HOOK: "131,0",
        EMERALD_BLOCK: "133,0",
        STAIRS_SPRUCE: "134,0",
        COMMAND_BLOCK: "137,0",
        BEACON: "138,0",
        WOOD_BUTTON: "143,0",
        COMPARATOR_ON: "150,0",
        DAYLIGHT_SENSOR: "151,0",
        QUARTZ_BLOCK_CHISELED: "155,1",
        HARDENED_CLAY_STAINED_WHITE: "159,0",
        HARDENED_CLAY_STAINED_ORANGE: "159,1",
        HARDENED_CLAY_STAINED_PURPLE: "159,10",
        HARDENED_CLAY_STAINED_BROWN: "159,12",
        HARDENED_CLAY_STAINED_BLACK: "159,15",
        HARDENED_CLAY_STAINED_LIGHT_BLUE: "159,3",
        HARDENED_CLAY_STAINED_LIME: "159,5",
        HARDENED_CLAY_STAINED_GRAY: "159,7",
        PRISMARINE: "168,0",
        PRISMARINE_DARK: "168,2",
        GLOWING_OBSIDIAN: "169,0",
        NETHER_REACTOR_CORE: "169,0",
        HAY_BLOCK: "170,0",
        CARPET: "171,0",
        CARPET_BLUE: "171,11",
        CARPET_GREEN: "171,13",
        CARPET_RED: "171,14",
        CARPET_MAGENTA: "171,2",
        CARPET_YELLOW: "171,4",
        CARPET_PINK: "171,6",
        CARPET_LIGHT_GRAY: "171,8",
        CARPET_CYAN: "171,9",
        HARDENED_CLAY: "172,0",
        LILAC: "175,1",
        LARGE_FERN: "175,3",
        ROSE_BUSH: "175,4",
        RED_SANDSTONE_CHISELED: "179,1",
        CHORUS_FLOWER: "200,0",
        PURPUR_PILLAR: "202,0",
        NETHER_WART_BLOCK: "214,0",
        BONE_BLOCK: "216,0",
        GLAZED_TERRACOTTA_WHITE: "235,0",
        GLAZED_TERRACOTTA_ORANGE: "236,0",
        GLAZED_TERRACOTTA_LIGHT_BLUE: "238,0",
        GLAZED_TERRACOTTA_LIME: "240,0",
        GLAZED_TERRACOTTA_GRAY: "242,0",
        GLAZED_TERRACOTTA_PURPLE: "245,0",
        GLAZED_TERRACOTTA_BROWN: "247,0",
        GLAZED_TERRACOTTA_BLACK: "250,0",
        CONCRETE_BLOCK_WHITE: "251,0",
        CONCRETE_BLOCK_ORANGE: "251,1",
        CONCRETE_BLOCK_PURPLE: "251,10",
        CONCRETE_BLOCK_BROWN: "251,12",
        CONCRETE_BLOCK_BLACK: "251,15",
        CONCRETE_BLOCK_LIGHT_BLUE: "251,3",
        CONCRETE_BLOCK_LIME: "251,5",
        CONCRETE_BLOCK_GRAY: "251,7",
        CONCRETE_POWDER: "252,0",
        CONCRETE_POWDER_BLUE: "252,11",
        CONCRETE_POWDER_GREEN: "252,13",
        CONCRETE_POWDER_RED: "252,14",
        CONCRETE_POWDER_MAGENTA: "252,2",
        CONCRETE_POWDER_YELLOW: "252,4",
        CONCRETE_POWDER_PINK: "252,6",
        CONCRETE_POWDER_LIGHT_GRAY: "252,8",
        CONCRETE_POWDER_CYAN: "252,9",
        CAULDRON: "380,0",
        ITEM_FRAME: "389,0",
        DOOR_JUNGLE: "429,0",
        DOOR_ACACIA: "430,0",
        DOOR_DARK_OAK: "431,0",
        BEETROOT: "434,0",
    }

    // Math
    class Vector3 {
        constructor(x, y, z) {
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

        _typeCheck(other) {
            if (other == null || !(other instanceof Vector3)) throw new Error('Input other is not instanceof Vector3');
        }

        add(other) {
            this._typeCheck(other);
            this.x += other.x;
            this.y += other.y;
            this.z += other.z;
            return this;
        }

        sub(other) {
            this._typeCheck(other);
            this.x -= other.x;
            this.y -= other.y;
            this.z -= other.z;
            return this;
        }

        mul(scalar) {
            const s = Number(scalar);
            if (isNaN(s)) throw new Error('Input Number is not a Number');
            this.x *= s;
            this.y *= s;
            this.z *= s;
            return this;
        }

        div(divisor) {
            const d = Number(divisor);
            if (isNaN(d)) throw new Error('Input Number is not a Number');
            if (d === 0) throw new Error('Input Number is 0');
            this.x /= d;
            this.y /= d;
            this.z /= d;
            return this;
        }

        length() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        }

        dot(other) {
            this._typeCheck(other);
            return this.x * other.x + this.y * other.y + this.z * other.z;
        }

        negate() {
            return this.mul(-1);
        }

        toString() {
            return `Vector3 <x=${this.x}, y=${this.y}, z=${this.z}>`;
        }

        clone() {
            return new Vector3(this.x, this.y, this.z);
        }

        cross(other) {
            this._typeCheck(other);
            return new Vector3(
                this.y * other.z - this.z * other.y,
                this.z * other.x - this.x * other.z,
                this.x * other.y - this.y * other.x
            );
        }

        static zero() {
            return new Vector3(0, 0, 0);
        }

        static one() {
            return new Vector3(1, 1, 1);
        }

        static fromArray(arr) {
            if (arr.length < 3) throw new Error('Input Array length less than 3');
            return new Vector3(arr[0], arr[1], arr[2]);
        }
    }

    const matrix = {
        multiply(a, b) {
            return [
                [a[0][0] * b[0][0] + a[0][1] * b[1][0] + a[0][2] * b[2][0], a[0][0] * b[0][1] + a[0][1] * b[1][1] + a[0][2] * b[2][1], a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2] * b[2][2]],
                [a[1][0] * b[0][0] + a[1][1] * b[1][0] + a[1][2] * b[2][0], a[1][0] * b[0][1] + a[1][1] * b[1][1] + a[1][2] * b[2][1], a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2] * b[2][2]],
                [a[2][0] * b[0][0] + a[2][1] * b[1][0] + a[2][2] * b[2][0], a[2][0] * b[0][1] + a[2][1] * b[1][1] + a[2][2] * b[2][1], a[2][0] * b[0][2] + a[2][1] * b[1][2] + a[2][2] * b[2][2]],
            ];
        },
        radians(deg) {
            return deg * Math.PI / 180;
        },
        degrees(rad) {
            return rad * 180 / Math.PI;
        },
        yaw(angleDegrees) {
            const theta = matrix.radians(angleDegrees);
            const c = Math.cos(theta);
            const s = Math.sin(theta);
            return [
                [c, 0, -s],
                [0, 1, 0],
                [s, 0, c]
            ];
        },
        pitch(angleDegrees) {
            const theta = matrix.radians(angleDegrees);
            const c = Math.cos(theta);
            const s = Math.sin(theta);
            return [
                [1, 0, 0],
                [0, c, s],
                [0, -s, c]
            ];
        },
        roll(angleDegrees) {
            const theta = matrix.radians(angleDegrees);
            const c = Math.cos(theta);
            const s = Math.sin(theta);
            return [
                [c, -s, 0],
                [s, c, 0],
                [0, 0, 1]
            ];
        },
        makeMatrix(yaw, pitch, roll) {
            return matrix.multiply(matrix.multiply(matrix.yaw(yaw), matrix.pitch(pitch)), matrix.roll(roll));
        },
        apply(m, v) {
            if (m == null) return v;
            return new Vector3(
                m[0][0] * v.x + m[0][1] * v.y + m[0][2] * v.z,
                m[1][0] * v.x + m[1][1] * v.y + m[1][2] * v.z,
                m[2][0] * v.x + m[2][1] * v.y + m[2][2] * v.z
            );
        }
    }

    // connection
    class Connection {
        constructor(host, port) {
            this.host = host ? host : 'localhost';
            this.port = port ? port : 14711;
            this.ws = new WebSocket(`ws://${this.host}:${this.port}`);
        }

        send(f, ...data) {
            this.ws.send(`${f.toString()}(${data.map(x => x.toString()).join(',')})\n`);
        }

        receive() {
            const t = this;
            return new Promise((resolve, reject) => {
                t.ws.onmessage = (event) => resolve(event.data.trim());
                t.ws.onerror = (err) => reject(err);
            });
        }

        sendReceive(f, ...data) {
            this.send(f, ...data);
            return this.receive();
        }
    }

    class CmdPositioner {
        constructor(conn, pkg) {
            this.conn = conn;
            this.pkg = pkg;
        }

        _sr(f, ...data) {
            return this.conn.sendReceive(`${this.pkg}.${f}`, ...data);
        }

        _s(f, ...data) {
            this.conn.send(`${this.pkg}.${f}`, ...data);
        }

        getPitch(id) {
            return this._sr("getPitch", id).then(value => Number(value));
        }

        getRotation(id) {
            return this._sr("getRotation", id).then(value => Number(value));
        }

        getNameAndUUID(id) {
            return this._sr("getNameAndUUID", id).then(value => {
                const comma = value.lastIndexOf(',');
                return [value.substring(0, comma), value.substring(comma + 1)];
            });
        }

        getDirection(id) {
            return this._sr("getDirection", id).then(value => new Vector3(...value.split(',').map(x => Number(x))));
        }

        getPos(id) {
            return this._sr("getPos", id).then(value => new Vector3(...value.split(',').map(x => Number(x))));
        }

        getTilePos(id) {
            return this._sr("getTile", id).then(value => new Vector3(...value.split(',').map(x => Number(x))));
        }

        setPos(id, x, y, z) {
            this._s("setPos", id, x, y, z);
        }

        setDirection(id, xr, yr, zr) {
            this._s("setDirection", id, xr, yr, zr);
        }

        setRotation(id, angle) {
            this._s("setRotation", id, angle);
        }

        setPitch(id, angle) {
            this._s("setPitch", id, angle);
        }

        setTilePos(id, x, y, z) {
            this._s("setTile", id, x, y, z);
        }
    }

    class CmdPlayer extends CmdPositioner {
        constructor(conn) {
            super(conn, "player");
        }

        getPitch() {
            return this._sr("getPitch").then(value => Number(value));
        }

        getRotation() {
            return this._sr("getRotation").then(value => Number(value));
        }

        getNameAndUUID() {
            return this._sr("getNameAndUUID").then(value => {
                const comma = value.lastIndexOf(',');
                return [value.substring(0, comma), value.substring(comma + 1)];
            });
        }

        getDirection() {
            return this._sr("getDirection").then(value => new Vector3(...value.split(',').map(x => Number(x))));
        }

        getPos() {
            return this._sr("getPos").then(value => new Vector3(...value.split(',').map(x => Number(x))));
        }

        getTilePos() {
            return this._sr("getTile").then(value => new Vector3(...value.split(',').map(x => Number(x))));
        }

        setPos(x, y, z) {
            this._s("setPos", x, y, z);
        }

        setDirection(xr, yr, zr) {
            this._s("setDirection", xr, yr, zr);
        }

        setRotation(angle) {
            this._s("setRotation", angle);
        }

        setPitch(angle) {
            this._s("setPitch", angle);
        }

        setTilePos(x, y, z) {
            this._s("setTile", x, y, z);
        }

        postToChat(...msg) {
            this.conn.send("player.chat.post", "", msg.map(x => x.toString().replace("\r", " ").replace("\n", " ")).join(" "));
        }
    }

    class CmdEntity extends CmdPositioner {
        constructor(conn) {
            super(conn, "entity");
        }
    }

    class CmdCamera {
        constructor(conn) {
            this.conn = conn;
        }

        setNormal(id) {
            this.conn.send("camera.mode.setNormal", id);
        }

        setFollow(id) {
            this.conn.send("camera.mode.setFollow", id);
        }
    }

    class Minecraft {
        constructor(host, port) {
            this.conn = new Connection(host, port);
            this.camera = new CmdCamera(this.conn);
            this.entity = new CmdEntity(this.conn);
            this.player = new CmdPlayer(this.conn);
        }

        postToChat(...msg) {
            this.conn.send('chat.post', msg.join(' ').replace('\n', ' '));
        }

        spawnEntity(id, x, y, z) {
            return this.conn.sendReceive("world.spawnEntity", id, x, y, z).then(value => parseInt(Number(value)));
        }

        removeEntity(id) {
            this.conn.send("world.removeEntity", id);
        }

        getBlock(x, y, z) {
            return this.conn.sendReceive("world.getBlock", x, y, z).then(value => parseInt(Number(value)));
        }

        setBlock(x, y, z, id, data) {
            let value = data ? [x, y, z, id, data] : [x, y, z, id];
            this.conn.send("world.setBlock", ...value);
        }

        setBlocks(x0, y0, z0, x1, y1, z1, id, data) {
            let value = data ? [x0, y0, z0, x1, y1, z1, id, data] : [x0, y0, z0, x1, y1, z1, id];
            this.conn.send("world.setBlocks", ...value);
        }

        getHeight(x, z) {
            return this.conn.sendReceive("world.getHeight", x, z).then(value => parseInt(Number(value)));
        }

        getPlayerEntityIds() {
            return this.conn.sendReceive("world.getPlayerEntityIds").then(value => value.split("|").map(x => parseInt(Number(x))));
        }

        setting(setting, status) {
            this.conn.send("world.setting", setting, Cast.toBoolean(status) * 1);
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

            // connect
            'javac.minecraft.block.connect.connectMinecraft': '在主机 [HOST] 的 [PORT] 连接到 Minecraft',
            // chat
            'javac.minecraft.block.chat.postToChat': '向所有玩家广播 [MESSAGE] 消息',
            // blocks
            'javac.minecraft.block.block.setBlock': '在 [X], [Y], [Z] 处放置方块 [BLOCK]',
            'javac.minecraft.block.block.setBlocks': '在 [X0], [Y0], [Z0] 到 [X1], [Y1], [Z1] 之间放置方块 [BLOCK]',
            'javac.minecraft.block.block.getBlock': '获取位于 [X], [Y], [Z] 的方块ID',
            'javac.minecraft.block.block.getHeight': '获取 [X], [Z] 的最高位置',
            'javac.minecraft.block.block.getBlockId': '获取方块 [BLOCK] 的ID',
            // entity
            'javac.minecraft.block.entity.spawnEntity': '在 [X], [Y], [Z] 处生成一个实体 [ENTITY]',
            'javac.minecraft.block.entity.spawnEntityReturns': '在 [X], [Y], [Z] 处生成一个实体 [ENTITY]，并获得实体ID',
            'javac.minecraft.block.entity.removeEntity': '删除ID为 [ENTITY] 的实体',
            'javac.minecraft.block.entity.getPitch': '获取实体 [ENTITY] 的俯仰角度',
            'javac.minecraft.block.entity.getRotation': '获取实体 [ENTITY] 的偏航角度',
            'javac.minecraft.block.entity.getNameAndUUID': '获取实体 [ENTITY] 的名字和UUID',
            'javac.minecraft.block.entity.getDirection': '获取实体 [ENTITY] 的XYZ旋转',
            'javac.minecraft.block.entity.getPos': '获取实体 [ENTITY] 的精确坐标',
            'javac.minecraft.block.entity.getTilePos': '获取实体 [ENTITY] 的方块坐标',
            'javac.minecraft.block.entity.setPos': '设置实体 [ENTITY] 的精确坐标为 [X], [Y], [Z]',
            'javac.minecraft.block.entity.setTilePos': '设置实体 [ENTITY] 的方块坐标为 [X], [Y], [Z]',
            'javac.minecraft.block.entity.setDirection': '设置实体 [ENTITY] 的XYZ旋转为 [X], [Y], [Z]',
            'javac.minecraft.block.entity.setRotation': '设置实体 [ENTITY] 的偏航角度为 [YAW]',
            'javac.minecraft.block.entity.setPitch': '设置实体 [ENTITY] 的俯仰角度为 [PITCH]',
            // player
            'javac.minecraft.block.player.getDirection': '获取玩家的XYZ旋转',
            'javac.minecraft.block.player.getPitch': '获取玩家的俯仰角度',
            'javac.minecraft.block.player.getRotation': '获取玩家的偏航角度',
            'javac.minecraft.block.player.getPos': '获取玩家的精确坐标',
            'javac.minecraft.block.player.getTilePos': '获取玩家的方块坐标',
            'javac.minecraft.block.player.getNameAndUUID': '获取玩家的名称和UUID',
            'javac.minecraft.block.player.setDirection': '设置玩家的XYZ旋转为 [X], [Y], [Z]',
            'javac.minecraft.block.player.setRotation': '设置玩家的偏航角度为 [YAW]',
            'javac.minecraft.block.player.setPos': '设置玩家的精确坐标为 [X], [Y], [Z]',
            'javac.minecraft.block.player.setTilePos': '设置玩家的方块坐标为 [X], [Y], [Z]',
            'javac.minecraft.block.player.setPitch': '设置玩家的俯仰角度为 [PITCH]',

            // 'javac.minecraft.block.cameraSetNormal': '' // camera not support
            // vector
            'javac.minecraft.block.vector.newVector': '3D向量 ([X], [Y], [Z])',
            'javac.minecraft.block.vector.add': '3D向量 [A] + [B]',
            'javac.minecraft.block.vector.sub': '3D向量 [A] - [B]',
            'javac.minecraft.block.vector.mul': '3D向量 [A] * [SCALAR]',
            'javac.minecraft.block.vector.div': '3D向量 [A] / [DIVISOR]',
            'javac.minecraft.block.vector.length': '3D向量 [VECTOR] 的长度',
            'javac.minecraft.block.vector.dot': '3D向量 [A] 与 [B] 的点积',
            'javac.minecraft.block.vector.negate': '3D向量 - [VECTOR]',
            'javac.minecraft.block.vector.clone': '3D向量 [VECTOR] 克隆',
            'javac.minecraft.block.vector.cross': '3D向量 [A] 与 [B] 的向量叉积',
            'javac.minecraft.block.vector.axis': '3D向量 [VECTOR] 的 [AXIS] 轴坐标',

            // turtle

            'javac.minecraft.block.turtle.initial': '初始化海龟',
            'javac.minecraft.block.turtle.penUp': '海龟提笔',
            'javac.minecraft.block.turtle.penDown': '海龟落笔',
            'javac.minecraft.block.turtle.setPenBlock': '海龟画笔方块 [BLOCK]',
            'javac.minecraft.block.turtle.forward': '海龟前进 [STEP]',
            'javac.minecraft.block.turtle.back': '海龟后退 [STEP]',
            'javac.minecraft.block.turtle.right': '海龟右转 [ANGLE]',
            'javac.minecraft.block.turtle.left': '海龟左转 [ANGLE]',
            'javac.minecraft.block.turtle.lookUp': '海龟头向上转 [ANGLE]',
            'javac.minecraft.block.turtle.lookDown': '海龟头向下转 [ANGLE]',

        }
    });

    class Mineturtle {
        constructor() {
        }
    }

    class ScratchMinecraft {
        constructor(_runtime) {
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

        fm(id) {
            return translate({id});
        }

        initBlocks() {
            const t = this;
            const makeBlock = (opcode, blockType, args, text, func) => {
                if (opcode && !blockType) {
                    t.blocks.push(opcode);
                    return;
                }
                ScratchMinecraft.prototype[opcode] = func;
                t.blocks.push({opcode, blockType, arguments: args, text});
            };

            // 连接
            makeBlock('---' + this.fm('javac.minecraft.tag.connect'));
            makeBlock(
                'connectMinecraft',
                BlockType.COMMAND,
                {
                    HOST: {type: ArgumentType.STRING, defaultValue: 'localhost'},
                    PORT: {type: ArgumentType.NUMBER, defaultValue: 14711}
                },
                this.fm('javac.minecraft.block.connect.connectMinecraft'),
                ({HOST, PORT}) => {
                    t.mc = new Minecraft(Cast.toString(HOST), Cast.toNumber(PORT));
                }
            );

            // 聊天
            makeBlock('---' + this.fm('javac.minecraft.tag.chat'));
            makeBlock(
                'postToChat',
                BlockType.COMMAND,
                {
                    MESSAGE: {type: ArgumentType.STRING, defaultValue: 'Hello World!'},
                },
                this.fm('javac.minecraft.block.chat.postToChat'),
                ({MESSAGE}) => {
                    t.mc.postToChat(MESSAGE);
                }
            );

            // 方块
            makeBlock('---' + this.fm('javac.minecraft.tag.block'));
            makeBlock(
                'setBlock',
                BlockType.COMMAND,
                {
                    X: {type: ArgumentType.NUMBER, defaultValue: 0},
                    Y: {type: ArgumentType.NUMBER, defaultValue: 0},
                    Z: {type: ArgumentType.NUMBER, defaultValue: 0},
                    BLOCK: {type: ArgumentType.STRING, menu: "BLOCKS"}
                },
                this.fm('javac.minecraft.block.block.setBlock'),
                ({X, Y, Z, BLOCK}) => t.mc.setBlock(Cast.toNumber(X), Cast.toNumber(Y), Cast.toNumber(Z), Cast.toString(BLOCK))
            );
            makeBlock(
                'setBlocks',
                BlockType.COMMAND,
                {
                    X0: {type: ArgumentType.NUMBER, defaultValue: 0},
                    Y0: {type: ArgumentType.NUMBER, defaultValue: 0},
                    Z0: {type: ArgumentType.NUMBER, defaultValue: 0},
                    X1: {type: ArgumentType.NUMBER, defaultValue: 0},
                    Y1: {type: ArgumentType.NUMBER, defaultValue: 0},
                    Z1: {type: ArgumentType.NUMBER, defaultValue: 0},
                    BLOCK: {type: ArgumentType.STRING, menu: "BLOCKS"},
                },
                this.fm('javac.minecraft.block.block.setBlocks'),
                ({X0, Y0, Z0, X1, Y1, Z1, BLOCK}) => t.mc.setBlocks(Cast.toNumber(X0), Cast.toNumber(Y0), Cast.toNumber(Z0), Cast.toNumber(X1), Cast.toNumber(Y1), Cast.toNumber(Z1), Cast.toString(BLOCK))
            );
            makeBlock(
                'getBlock',
                BlockType.COMMAND,
                {
                    X: {type: ArgumentType.NUMBER, defaultValue: 0},
                    Y: {type: ArgumentType.NUMBER, defaultValue: 0},
                    Z: {type: ArgumentType.NUMBER, defaultValue: 0},
                },
                this.fm('javac.minecraft.block.block.getBlock'),
                ({X, Y, Z}) => t.mc.getBlock(Cast.toNumber(X), Cast.toNumber(Y), Cast.toNumber(Z))
            );

            // 实体
            // 玩家
            // 相机
            // 向量
            // 绘图
        }

        getInfo() {
            return this.info;
        }
    }

    extensions.register(new ScratchMinecraft(runtime));

})(Scratch);