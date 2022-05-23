import {
  autocmd,
  Denops,
  ensureNumber,
  fn,
  popup,
} from "./deps.ts";
import { getByte } from "./byte.ts"

async function makeEmptyBuffer(denops: Denops): Promise<number> {
  const bufnr = await denops.call("nvim_create_buf", false, true);
  ensureNumber(bufnr);
  return bufnr;
}

function closeCmd(winid: number): string {
  return `nvim_win_close(${winid}, v:false)`;
};

export async function openPopup(
  denops: Denops,
  content: string,
): Promise<void> {
  const winrow = await fn.winline(denops);
  const wincol = await fn.wincol(denops);

  let row: number;
  if (winrow <= 3) {
    row = 4;
  } else {
    row = winrow + 1;
  }

  const style: popup.PopupWindowStyle = {
    row,
    col: wincol,
    width: getByte(content) + 2,
    height: 1,
    border: true,
  }
  const bufnr = await makeEmptyBuffer(denops);
  ensureNumber(bufnr);

  const popupWinId = await popup.open(denops, bufnr, style);
  ensureNumber(popupWinId);

  await denops.call("setbufline", bufnr, 1, content);

  // autoclose popup, when move cursor
  const cmd = closeCmd(popupWinId);
  await autocmd.group(denops, "dps_float_close", (helper) => {
    helper.remove(
      ["CursorMoved", "CursorMovedI", "VimResized"],
      "*",
    );
    helper.define(
      ["CursorMoved", "CursorMovedI", "VimResized"],
      "*",
      `if (line('.') != ${winrow} || virtcol('.') != ${wincol}) | call ${cmd} | augroup dps_float_close | autocmd! | augroup END | endif`,
    )
  });

  return await Promise.resolve();
};
