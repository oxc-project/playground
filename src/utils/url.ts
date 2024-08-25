// Code partly copied from Rome and sxzz/ast-explorer
// <https://github.com/rome/tools/blob/665bb9d810b4ebf4ea82b72df20ad79b8fa3a3d0/website/src/playground/utils.ts#L141-L181>
// https://github.com/sxzz/ast-explorer/blob/main/utils/url.ts

import { strFromU8, strToU8, unzlibSync, zlibSync } from "fflate";
import throttle from "lodash.throttle";
import { PLAYGROUND_CODE_STORAGE } from "./constants";

const getStringFromStorage = (whatToGet: string) => {
  try {
    return localStorage.getItem(whatToGet);
  } catch {
    return "";
  }
};

const setStringToStorage = (whatToSet: string, value: string) => {
  try {
    localStorage.setItem(whatToSet, value);
  } catch {
    return;
  }
};

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
        const res = this.decodeCode(params.get("code")!);
        return res;
      }
      return getStringFromStorage(PLAYGROUND_CODE_STORAGE);
    } catch (error) {
      console.error(error);
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
    const buffer = strToU8(code);
    const zipped = zlibSync(buffer, { level: 9 });
    const binary = strFromU8(zipped, true);
    return btoa(binary);
  }

  decodeCode(encoded: string) {
    const binary = atob(encoded);

    // zlib header (x78), level 9 (xDA)
    if (binary.startsWith("\u0078\u00DA")) {
      const buffer = strToU8(binary, true);
      const unzipped = unzlibSync(buffer);
      return strFromU8(unzipped);
    }

    // old unicode hacks for backward compatibility
    // https://base64.guru/developers/javascript/examples/unicode-strings
    return decodeURIComponent(escape(binary));
  }
}

export const urlParamsInst = new URLParams();
