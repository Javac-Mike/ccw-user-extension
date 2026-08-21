import * as three from 'https://unpkg.com/three@0.128.0/build/three.module.js'

(function (Scratch) {
  const {
    vm,
    runtime,
    ArgumentType,
    BlockType,
    TargetType,
    Cast,
    translate,
    extensions
  } = Scratch;

  // i18n settings
  translate.setup({
    zh: {
      'javac.three.extensionName': 'THREE',
      'javac.three.tag.wgr': 'WebGL渲染器',
      'javac.three.tag.scene': '场景',
      'javac.three.tag.camera': '相机',

      'javac.three.block.wgr.init': '初始化 WebGL 渲染器',
//      'javac.three.block.wgr.setattr': '设置WebGL渲染器的属性 [ATTRIBUTE] 为 [VALUE]',
      'javac.three.block.wgr.enable': '启用 WebGL 渲染器的 [ATTRIBUTE]',
      'javac.three.block.wgr.disable': '禁用 WebGL 渲染器的 [ATTRIBUTE]',
      'javac.three.menu.wgr.attribute.shadowMap': '阴影',
    }
  });

  class ThreeExtension {
    renderer;
    stageCanvas;
    constructor(_runtime) {
      this._runtime = _runtime;
    }

    makeBlock(_opcode, _blockType, _text, _args, _filter, _func){
      eval('this.'+_opcode+'=_func;');
      let block = {opcode: _opcode, blockType: _blockType, text: translate({id: _text})};
      if (_args != null) {
        block.arguments = _args;
      }
      if (_filter != null) {
        block.filter = _filter;
      }
      return block;
    }

    sep(_text) {
      return '---'+_text;
    }

    spi(_id) {
      return '---'+translate({id: _id});
    }

    getInfo() {
      return {
        id: 'javac.three',
        name: translate({id: 'javac.three.extensionName'}),
        color1: '#FF8C1A',
        color2: '#DB6E00',
        // menuIconURI: "",
        // blockIconUrl: "",

        blocks: [
          this.spi('javac.three.tag.wgr'),
          this.makeBlock('initWebGLRenderer', BlockType.COMMAND, 'javac.three.block.wgr.init', null, null, () => {
            console.log(this.renderer);
            console.log(this.stageCanvas);
            if (this.renderer){return;}
            this.stageCanvas = document.getElementsByClassName('ccw-stage-wrapper')[0].getElementsByTagName('div')[0].getElementsByTagName('canvas')[0];
            console.log(this.stageCanvas);
            this.renderer = new three.WebGLRenderer({canvas: this.stageCanvas, antialias: true});
            this.renderer.setPixelRatio(window.devicePixelRatio);
          }),
          this.makeBlock('enableWebGLRenderAttribute', BlockType.COMMAND, 'javac.three.block.wgr.enable', {
            ATTRIBUTE: {
              type: ArgumentType.STRING,
              menu: 'WebGLRendererAttributesMenu'
            }
          }, null, (args) => {
            console.log(args.ATTRIBUTE);
            eval('this.renderer.'+args.ATTRIBUTE+' = true;');
            console.log(this.renderer.shadowMap.enabled);
          }),
          this.makeBlock('disableWebGLRenderAttribute', BlockType.COMMAND, 'javac.three.block.wgr.disable', {
            ATTRIBUTE: {
              type: ArgumentType.STRING,
              menu: 'WebGLRendererAttributesMenu'
            }
          }, null, (args) => {
            console.log(args.ATTRIBUTE);
            eval('this.renderer.'+args.ATTRIBUTE+' = false;');
            console.log(this.renderer.shadowMap.enabled);
          }),
        ],
        menus: {
          WebGLRendererAttributesMenu: [
            {
              text: translate({id: 'javac.three.menu.wgr.attribute.shadowMap'}),
              value: 'shadowMap.enabled',
            },
          ]
        }
      };
    }
  }

  extensions.register(new ThreeExtension(runtime));
})(Scratch);