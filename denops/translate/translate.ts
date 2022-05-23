import { ky } from "./deps.ts"

type TranslateResult = {
  code: number
  text: string
}
export type TranslateRule = {
  source: string,
  target: string,
}

export async function translate(
  text: string,
  rule: TranslateRule,
): Promise<string> {
  const endpoint = 'https://script.google.com/macros/s/AKfycby0b3RopmwIda0_xRaixdjCue6CAk8cfNWHpBozyocOv3cVqbKbtSNHsh5MfQ3BiPaR/exec';

  const params = new URLSearchParams({
    text,
    source: rule.source,
    target: rule.target,
  });

  const response = await ky.get(endpoint + '?' + params);

  if (response.status !== 200) {
    throw new Error(`Invalid status code: ${response.status}`);
  };

  try {
    const result: TranslateResult = await response.json();
    if (result.code != 200) {
      throw new Error(`Invalid status code: ${result.code}`);
    }
    return result.text;
  } catch (e) {
    throw e
  }
}
