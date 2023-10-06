export const types = ["GPT-3.5", "GPT-4"] as const

export type ModelType = (typeof types)[number]

export interface Model<Type = string> {
  id: string
  name: string
  description: string
  strengths?: string
  type: Type
}

export const models: Model<ModelType>[] = [
  {
    id: "c305f976-8e38-42b1-9fb7-d21b2e34f0da",
    name: "gpt-3.5-turbo",
    description:
      "Fast and Capable.",
    type: "GPT-3.5",
    strengths:
      "Complex intent, cause and effect, creative generation, search, summarization for audience",
  },
  {
    id: "464a47c3-7ab5-44d7-b669-f9cb5a9e8465",
    name: "GPT-4",
    description: "Very Capable but Slow AF.",
    type: "GPT-4",
    strengths:
      "Moderate reasoning and causality, very capable",
  },
]