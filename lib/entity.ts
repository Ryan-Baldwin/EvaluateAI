import axios from 'axios';

type OpenAIResponse = {
    choices: Array<{ message: { content: string }, text: string }>;
    usage: { prompt_tokens: number, completion_tokens: number };
};

export class Entity {
    model: string = "gpt-3.5-turbo";
    cost: number = 0;
    role?: string;
    temperature: number = 1.0;
    max_tokens: number = 500;
    top_p: number = 1.0;
    presence_penalty: number = 0.0;
    frequency_penalty: number = 0.0;

    constructor() {
        // Initialize default values if needed
        this.temperature = 0.7; // example default value
        this.max_tokens = 150;  // example default value
        // ... initialize other properties as needed
      }
    

      async action(task: string, examples: Array<[string, string]> = [], system_primer: string = "", temperature?: number, max_tokens?: number, top_p?: number, presence_penalty?: number, frequency_penalty?: number) {
        temperature = temperature || this.temperature;
        max_tokens = max_tokens || this.max_tokens;
        top_p = top_p || this.top_p;
        presence_penalty = presence_penalty || this.presence_penalty;
        frequency_penalty = frequency_penalty || this.frequency_penalty;
    
        const messages = [{ role: "system", content: system_primer }];
    
        for (const example of examples) {
          const [action_example, result_example] = example;
          messages.push({ role: "user", content: action_example });
          messages.push({ role: "assistant", content: result_example });
        }
    
        messages.push({ role: "user", content: task });
        
        try {
        const response = await axios.post('/api/ai/chat', {
          messages: messages,
          temperature: temperature,
          max_tokens: max_tokens,
          top_p: top_p,
          model: this.model,
          // Add other parameters if needed
        });
    
        return response.data;
        } catch 
        (error) {
            console.log('[ENTITY_ERROR]', error);
            throw error;
        }
    }    

    calculateCost(response: OpenAIResponse): number {
        let pricing: number;
        let completionPricing: number;

        switch (this.model) {
            case "gpt-4":
                pricing = .03 / 1000;
                completionPricing = .06 / 1000;
                break;
            case "text-davinci-003":
                pricing = .02 / 1000;
                completionPricing = .02 / 1000;
                break;
            case "gpt-3.5-turbo":
            default:
                pricing = .002 / 1000;
                completionPricing = .002 / 1000;
        }

        const cost = response.usage.prompt_tokens * pricing + response.usage.completion_tokens * completionPricing;
        return cost;
    }

    actionCost(task: string, examples: Array<[string, string]> = [], system_primer: string = "", temperature?: number, max_tokens?: number, top_p?: number, presence_penalty?: number, frequency_penalty?: number): [string, number] {
        const result = this.action(task, examples, system_primer, temperature, max_tokens, top_p, presence_penalty, frequency_penalty);
        const response = result.choices[0].message.content.trim();
        const cost = this.calculateCost(result);
        return [response, cost];
    }

    actions(task: string, examples: Array<[string, string]> = [], system_primer: string = "", temperature?: number, max_tokens?: number, top_p?: number, presence_penalty?: number, frequency_penalty?: number): string {
        const result = this.action(task, examples, system_primer, temperature, max_tokens, top_p, presence_penalty, frequency_penalty);
        return result.choices[0].message.content.trim();
    }

    instruct(task: string, examples: Array<string> = [], system_primer: string = "", temperature?: number, max_tokens?: number, top_p?: number, presence_penalty?: number, frequency_penalty?: number): OpenAIResponse {
        // Mocking the OpenAI API call for demonstration purposes
        return {
            choices: [{ message: { content: "Sample content" }, text: "Sample text" }],
            usage: { prompt_tokens: 10, completion_tokens: 20 }
        };
    }

    instructCost(task: string, examples: Array<string> = [], system_primer: string = "", temperature?: number, max_tokens?: number, top_p?: number, presence_penalty?: number, frequency_penalty?: number): [string, number] {
        const result = this.instruct(task, examples, system_primer, temperature, max_tokens, top_p, presence_penalty, frequency_penalty);
        const response = result.choices[0].text.trim();
        const cost = this.calculateCost(result);
        return [response, cost];
    }

    instructs(task: string, examples: Array<string> = [], system_primer: string = "", temperature?: number, max_tokens?: number, top_p?: number, presence_penalty?: number, frequency_penalty?: number): string {
        const result = this.instruct(task, examples, system_primer, temperature, max_tokens, top_p, presence_penalty, frequency_penalty);
        return result.choices[0].text.trim();
    }
}
