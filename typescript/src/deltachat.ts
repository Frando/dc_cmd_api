import { RawApi } from "./bindings";

import WebSocket from "isomorphic-ws";
import { JSON_RPC_Error } from "./json_rpc_error";
import { EventEmitter } from "eventemitter3";
import { get_event_name_from_id } from "./events";

export interface Event {
  id: number;
  contextId: number;
  field1: string | number | null;
  field2: string | number | null;
}

export class DeltaChat extends EventEmitter<
  ReturnType<typeof get_event_name_from_id> | "socket_connection_change",
  any
> {
  raw_api: RawApi = new RawApi(this.call.bind(this));
  private backend_connection: boolean = false;

  isConnectedToBackend() {
    return this.backend_connection;
  }

  private callbacks: {
    [invocation_id: number]: { res: Function; rej: Function } | null;
  } = {};
  private invocation_id_counter = 1;

  private socket: WebSocket | null = null;
  private cleanupSocketListeners: (() => void) | null = null;
  logDebug: typeof console.debug = (...args: any) => {};
  log: typeof console.log = (...args: any) => {};
  logInfo: typeof console.info = (...args: any) => {};

  constructor(
    public address: string,
    logLevel: "debug" | "normal" | "silent" = "debug"
  ) {
    super();

    switch (logLevel) {
      case "debug":
        this.logDebug = console.debug;
      case "normal":
        this.log = console.log;
        this.logInfo = console.info;
        break;
      default:
        break;
    }
  }

  connect(): Promise<void> {
    return new Promise((res, rej) => {
      if (this.socket) {
        this.log("socket already exists - running cleanup first");
        if (this.cleanupSocketListeners) {
          this.cleanupSocketListeners();
        }
        this.socket.close(4000);
      }

      this.log("connecting to", this.address);
      this.socket = new WebSocket(this.address);
      const self = this; // socket event callback overwrites this to undefined sometimes

      const onMessage = this.onMessage.bind(self);
      const onError = (event: any) => {
        console.error(event);
        // TODO handle error
        self.backend_connection = false;
        this.emit("socket_connection_change", false);
        rej("socket error");
      };
      const onClose = (_event: any) => {
        this.logDebug("socket is closed now");
        self.backend_connection = false;
        this.emit("socket_connection_change", false);
      };
      const onOpen = (_event: any) => {
        this.logDebug("socket is open now");
        self.backend_connection = true;
        this.emit("socket_connection_change", true);
        res();
      };

      this.socket.addEventListener("message", onMessage);
      this.socket.addEventListener("error", onError);
      this.socket.addEventListener("close", onClose);
      this.socket.addEventListener("open", onOpen);
      this.cleanupSocketListeners = () => {
        if (!this.socket) {
          return;
        }
        this.socket.removeEventListener("message", onMessage);
        this.socket.removeEventListener("error", onError);
        this.socket.removeEventListener("close", onClose);
        this.socket.removeEventListener("open", onOpen);
      };
    });
  }

  private onMessage(event: { data: any; type: string; target: WebSocket }) {
    // handle answer
    // console.debug({ event });
    let answer;
    try {
      answer = JSON.parse(event.data);
    } catch (error) {
      console.log("message recieved is not valid json:", event.data, error);
      return;
    }
    this.logDebug("<--", answer);
    if (answer.method === "event") {
      if (!answer.params) {
        throw new Error("invalid event, data missing");
      }
      this.emit(get_event_name_from_id(answer.params.id), answer.params);
    } else {
      // handle command results
      if (!answer.id) {
        throw new Error("invocation_id missing");
      }
      const callback = this.callbacks[answer.id];
      if (!callback) {
        throw new Error(`No callback found for invocation_id ${answer.id}`);
      }

      if (answer.error) {
        callback.rej(
          new JSON_RPC_Error(
            answer.error.code,
            answer.error.message,
            answer.error.data
          )
        );
      } else {
        callback.res(answer.result || null);
      }

      this.callbacks[answer.id] = null;
    }
  }

  private call(method: string, params?: any): Promise<any> {
    if (!this.backend_connection) throw new Error("Not connected to backend");

    const invocation_id = this.invocation_id_counter++;
    const promise = new Promise((res, rej) => {
      this.callbacks[invocation_id] = { res, rej };
    });

    let data = {
      jsonrpc: "2.0",
      method,
      id: invocation_id,
      params,
    };

    try {
      // make sure all errors are contained in the promise result
      this.logDebug("-->", data);
      if (!this.socket) {
        throw Error("no socket!");
      }
      this.socket.send(JSON.stringify(data));
      return promise;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  _currentCallCount() {
    return Object.keys(this.callbacks).length;
  }

  _currentUnresolvedCallCount() {
    return Object.keys(this.callbacks).filter(
      (key) => this.callbacks[Number(key)] !== null
    ).length;
  }
}
