import {
  Denops,
  ensureArray,
  ensureNumber,
  ensureString,
  ensureObject,
  execute,
  fn,
  ky,
  isString,
  isUndefined,
} from "./deps.ts";
import { openPopup } from "./popup.ts";
import { translate, TranslateRule } from "./translate.ts";

const endpoint = 'https://script.google.com/macros/s/AKfycby0b3RopmwIda0_xRaixdjCue6CAk8cfNWHpBozyocOv3cVqbKbtSNHsh5MfQ3BiPaR/exec'
const ja = 'ja'
const en = 'en'

// curl -H "Content-Type: application/json" -L https://script.google.com/macros/s/AKfycby0b3RopmwIda0_xRaixdjCue6CAk8cfNWHpBozyocOv3cVqbKbtSNHsh5MfQ3BiPaR/exec?text=Hello\&source=en\&target=ja
export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    async translate(
      bang: unknown,
      line1: unknown,
      line2: unknown,
      arg: unknown,
    ): Promise<unknown> {

      ensureString(bang)
      ensureNumber(line1);
      ensureNumber(line2);
      if (isString(arg)) {
        ensureString(arg);
      }

      const text = arg ?? (
          line1 === line2
            ? await fn.getline(denops, line1)
            : (await fn.getline(denops, line1, line2)).join(" ")
        )
      ensureString(text)


      const isBang = bang === '!'
      const rule: TranslateRule = {
        source: isBang ? ja : en,
        target: isBang ? en : ja,
      }

      const result = await translate(text, rule)
      console.log(result)

      // const lastLine = await denops.call("line", "$");
      // ensureNumber(lastLine);
      // const lines = await denops.call("getline", 1, lastLine);
      // ensureArray(lines, isString);

      // const text = lines.map((x) => x.trim()).join("");
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
      return await Promise.resolve();
    },
  };

  await execute(
    denops,
    `command! -bang -range -nargs=? Translate echomsg denops#request('${denops.name}', 'translate', ['<bang>', <line1>,<line2>, <f-args>])`,
  )
};
