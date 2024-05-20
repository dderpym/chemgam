import { EnhancedGenerateContentResponse } from "@google/generative-ai";

export class Cache {
  private map: { [reactants: string]: EnhancedGenerateContentResponse };
  constructor(
    map: { [reactants: string]: EnhancedGenerateContentResponse } = {},
  ) {
    this.map = map;
  }

  prompt(reactants: string) {
    const ordered = this.order(reactants);

    return this.map[ordered];
  }

  remember(reactants: string, result: EnhancedGenerateContentResponse) {
    this.map[this.order(reactants)] = result;
  }

  private order(string: string) {
    return string
      .trim()
      .split(" + ")
      .sort((a, b) => a.localeCompare(b))
      .join("+");
  }

  toJSON() {
    return JSON.stringify(this.map);
  }

  static fromJSON(json: string) {
    return new Cache(JSON.parse(json));
  }
}
