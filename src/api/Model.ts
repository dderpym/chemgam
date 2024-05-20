// node --version # Should be >= 18
// npm install @google/generative-ai

import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { Cache } from "./Cache";

const MODEL_NAME = "gemini-1.5-flash-latest";
const generationConfig = {
  temperature: 1,
  topK: 64,
  topP: 0.95,
  maxOutputTokens: 8192,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const inputLine = (prompt: string) => {
  return { text: "input: " + prompt };
};

const parts = [
  {
    text: "You will receive the reactants of a chemical reaction. Your goal is to predict the products of that chemical reaction accurately. You need not comply with conservation of mass. Assume that there may be enough reactants to create the products. However, it is impossible to create new atoms in this manner. No matter what, NEVER include atoms in the product that were not given in the reaction. You will respond with the products of the reaction alone.",
  },
  { text: "input: O_3 + Cl" },
  { text: "output: O_2 + ClO" },
  { text: "input: ClO + O" },
  { text: "output: Cl + O_2" },
  { text: "input: CH_4 + 2O_2" },
  { text: "output: CO_2 + 2H_2O" },
  { text: "input: Fe + O_2" },
  { text: "output: " },
];

export class Model {
  private model;
  private cache: Cache;
  constructor(api_key: string) {
    const genAI = new GoogleGenerativeAI(api_key);
    this.model = genAI.getGenerativeModel({ model: MODEL_NAME });
    this.cache = new Cache();
  }

  async run(prompt: string) {
    parts[parts.length - 2] = inputLine(prompt);

    const cache = this.cache.prompt(prompt);
    if (cache) {
      console.log("vrooom! cache acceleration!!!");
      return cache;
    }

    const result = await this.model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });
    this.cache.remember(prompt, result.response);

    return result.response;
  }
}
