import {
  Denops,
  ensureNumber,
  ensureString,
  execute,
  fn,
  isString,
} from "./deps.ts";
import { openPopup } from "./popup.ts";
import { translate, TranslateRule } from "./translate.ts";

const ja = 'ja'
const en = 'en'

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

      await openPopup(denops, result)

      return await Promise.resolve();
    },
  };

  await execute(
    denops,
    `command! -bang -range -nargs=? Translate echomsg denops#request('${denops.name}', 'translate', ['<bang>', <line1>,<line2>, <f-args>])`,
  )
};
