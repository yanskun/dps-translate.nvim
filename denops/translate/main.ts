import {
  Denops,
  ensureArray,
  ensureNumber,
  ensureObject,
  execute,
  ky,
  isString,
} from "./deps.ts";
import { openPopup } from "./popup.ts";

const endpoint = 'https://script.google.com/macros/s/AKfycby0b3RopmwIda0_xRaixdjCue6CAk8cfNWHpBozyocOv3cVqbKbtSNHsh5MfQ3BiPaR/exec'
const ja = 'ja'
const en = 'en'

// curl -H "Content-Type: application/json" -L https://script.google.com/macros/s/AKfycby0b3RopmwIda0_xRaixdjCue6CAk8cfNWHpBozyocOv3cVqbKbtSNHsh5MfQ3BiPaR/exec?text=Hello\&source=en\&target=ja
export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    async translate() {

      const lastLine = await denops.call("line", "$");
      ensureNumber(lastLine);
      const lines = await denops.call("getline", 1, lastLine);
      ensureArray(lines, isString);

      const text = lines.map((x) => x.trim()).join("");
      // const escaped = args.replace(
      //   /[\\^$.*+?()[\]{}|]/g,
      //   "\\$&",
      // );
      // const regex = new RegExp(`${escaped}(.+)${escaped}`);
      //
      // const row = await denops.call("line", ".");
      // ensureNumber(row);
      // const vcol = await denops.call("virtcol", ".");
      // ensureNumber(vcol);
      //
      // const matches = text.match(regex);
      // if (matches == null) {
      //   console.error("any string is matched");
      // } else {
      //   const currentBufnr = await denops.call("bufnr", "%");
      //   ensureNumber(currentBufnr);
      //   const content = `${matches[1].length} chars`;
      //   await openPopup(denops, content, true);
      // }
      // console.log(text)

      const url = `${endpoint}?text=${text}&source=${en}&target=${ja}`;
      const response = await ky.get(url).json();
      ensureObject(response);
      console.log(response.text)
      return await Promise.resolve();
    },
  };

  await execute(
    denops,
    `command! Translate echomsg denops#request('${denops.name}', 'translate', [])`,
  )
};
