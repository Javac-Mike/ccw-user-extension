import { $ } from "https://code.jquery.com/jquery-4.0.0.module.min.js";

(function (_Scratch) {
    const { ArgumentType, BlockType, Cast, extensions } = _Scratch;

    /* --------WebSocket-------- */
    class WebsocketExtended {
        constructor (url) {
            this.url = url;
            this.openState = false;
            const t = this;
            this.ws = new WebSocket(url);
            this.ws.onopen = () => t.openState = true;
            this.ws.onclose = () => t.openState = false;
        }

        send (...args) {this.ws.send(...args);}
        get readyState () {return this.ws.readyState;}
        close () {
            this.openState = false;
            this.ws.close();
        }
        receive (...args) {
            const t = this;
            return new Promise((resolve, reject) => {
                t.ws.onmessage = (event) => resolve(event.data);
                t.ws.onerror = (event) => reject(event);
            });
        }
    }

    class WebSocketExtension {
        constructor(_runtime) {
            this.runtime = _runtime;
        }
    }
})(Scratch);