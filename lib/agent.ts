import { Entity } from './entity';
import { Tool } from './tool';



interface Message {
    role: string;
    content: string;
}

interface Tool {
    name: string;
    execute: (...args: any[]) => any;
}

export class Agent extends Entity {
    tools: { [key: string]: Tool } = {};
    chatHistory: Message[] = [];
    totalCost: number = 0;

    constructor(model: string = "gpt-3.5-turbo", role: string = "Intelligent Agent", temperature: number = 0.8, maxTokens: number = 100, topP: number = 1, presencePenalty: number = 0, frequencyPenalty: number = 0) {
        super();
        this.model = model;
        this.role = role;
        this.temperature = temperature;
        this.maxTokens = maxTokens;
        this.topP = topP;
        this.presencePenalty = presencePenalty;
        this.frequencyPenalty = frequencyPenalty;
        this.tools = {};
    }

    chatHistoryToDataframe(): any {  // You'll need to replace this with a TypeScript equivalent for DataFrame
        // Implementation here
    }

    chat(task: string, examples: any[] = [], systemPrimer?: string, chatHistory: Message[] = []): [string, number] {
        if (!systemPrimer) {
            systemPrimer = this.role;
        }

        let messages: Message[] = chatHistory.concat([{ role: "system", content: systemPrimer }]);

        for (const example of examples) {
            const [userTaskExample, taskCompletionExample] = example;
            messages.push({ role: "user", content: userTaskExample });
            messages.push({ role: "assistant", content: taskCompletionExample });
        }

        messages.push({ role: "user", content: task });

        // You'll need to replace the next lines with the TypeScript equivalent for the openai.ChatCompletion.create method
        const response: any = {};  // Placeholder
        const taskCompletion: string = response.choices[0].message.content.trim();
        const cost: number = this.calculateCost(response);
        this.totalCost += cost;
        messages.push({ role: "assistant", content: taskCompletion });
        this.chatHistory.push(...messages.slice(-2));

        return [taskCompletion, cost];
    }

    getChatHistory(): Message[] {
        return this.chatHistory;
    }

    clearChatHistory(): void {
        this.chatHistory = [];
    }

    getTotalCost(): number {
        let totalCost: number = 0;
        for (const message of this.chatHistory) {
            if (message.role === 'assistant') {
                totalCost += message.cost;  // Assuming cost is a property of message
            }
        }
        return totalCost;
    }

    workOnObjective(objective: string, tool: Tool, workspace: any): string {
        const task: string = `${this.name} is using ${tool.name} to ${objective} in ${workspace.name}.`;
        const response: string = this.actions(task);
        return response;
    }

    evaluatePlan(plan: string, objective: string, strategy: string): string {
        const evaluatedPlan: string = this.actions(`The following plan is designed to achieve the following objective: ${objective} \n\n in service of this strategy: ${strategy} \n\n plan: ${plan}\n\n Evaluate the plan and update it to make it more effective. Return the plan in the same format as the original.`);
        return evaluatedPlan;
    }

    registerTool(tool: Tool): void {
        this.tools[tool.name] = tool;
    }

    useTool(toolName: string, ...args: any[]): any {
        const tool: Tool | undefined = this.tools[toolName];
        if (!tool) {
            throw new Error(`Tool '${toolName}' not found.`);
        }
        return tool.execute(...args);
    }
}
