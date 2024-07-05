import throttle from "lodash.throttle";
// lzma is a very old library, it writes to window when built in production with vite.
import { LZMA } from "lzma/src/lzma_worker.js";
import { PLAYGROUND_CODE_STORAGE } from "./constants";

const GLOBAL_LZMA = LZMA || window.LZMA;

const getStringFromStorage = (whatToGet: string) => {
  try {
    return localStorage.getItem(whatToGet);
  } catch (_e) {
    return "";
  }
};

const setStringToStorage = (whatToSet: string, value: string) => {
  try {
    localStorage.setItem(whatToSet, value);
  } catch (_e) {
    return;
  }
};

// Code partly copied from Rome
// <https://github.com/rome/tools/blob/665bb9d810b4ebf4ea82b72df20ad79b8fa3a3d0/website/src/playground/utils.ts#L141-L181>
export class URLParams {
  // Safari/Webkit/JSC/whatever only allows setting a URL 50 times within 30 seconds
  // set our maximum update frequency just under that to avoid any chance of hitting it
  static URL_UPDATE_THROTTLE = 30000 / 40;

  params;
  code;

  constructor() {
    this.params = new URLSearchParams(window.location.search);
    this.code = this.tryReadCode(this.params);
  }

  tryReadCode(params: URLSearchParams) {
    try {
      if (params.has("code")) {
        const res = this.decodeCode(params.get("code"));
        return res;
      }
      return getStringFromStorage(PLAYGROUND_CODE_STORAGE);
    } catch (e) {
      console.error(e);
      return "";
    }
  }

  updateCode = throttle(
    (code) => {
      this.code = this.encodeCode(code);
      this.params.set("code", this.code);
      const url = `${window.location.protocol}//${window.location.host}${
        window.location.pathname
      }?${this.params.toString()}`;
      window.history.replaceState({ path: url }, "", url);
      setStringToStorage(PLAYGROUND_CODE_STORAGE, code);
    },
    URLParams.URL_UPDATE_THROTTLE,
    { trailing: true },
  );

  encodeCode(code: string) {
    const lzma = GLOBAL_LZMA.compress(code);
    return this.LZMABufferToBase64(lzma);
  }

  decodeCode(encoded: string) {
    const compressed = this.base64ToLZMABuffer(encoded);
    return GLOBAL_LZMA.decompress(compressed);
  }

  // https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem
  // btoa is safe here, because we manually construct a string of code points
  // which are guaranteed to be one-byte chars
  // the 128 offset is to compensate for LZMA's -128 to 127 range
  LZMABufferToBase64 = (buffer) =>
    btoa(Array.from(buffer, (x) => String.fromCodePoint(x + 128)).join(""));
  base64ToLZMABuffer = (base64) =>
    Uint8Array.from(atob(base64), (m) => m.codePointAt(0) - 128);
}

export const urlParamsInst = new URLParams();
