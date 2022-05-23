export function getByte(str: string): number {
  let length = 0;
  for (let i = 0; i < str.length; i++) {
    const s = /^[a-zA-Z0-9!-/:-@¥[-`{-~]*$/.test(str[i]);
    length += s ? 1 : 2;
  }
  return length;
}
