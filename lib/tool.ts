// Importing the Entity class from the Entity.ts file.
import { Entity } from './entity';

// Defining an interface for Tool. This ensures that any class implementing this interface
// will have the specified properties and methods.
export interface Tool {
    name: string; // Name of the tool.
    execute: (...args: any[]) => any; // A method to execute the tool's functionality.
}

// The ToolClass is a concrete class that extends the Entity class and implements the Tool interface.
export class Class extends Entity {
    // Properties specific to the ToolClass.
    name: string;
    description: string;
    instructions: string;

    // Constructor for the ToolClass. It initializes the properties with default values or provided values.
    constructor(
        model: string = "gpt-3.5-turbo", 
        role: string = "A useful tool used by an agent", 
        temperature: number = 0.8, 
        maxTokens: number = 100, 
        topP: number = 1, 
        presencePenalty: number = 0, 
        frequencyPenalty: number = 0, 
        name: string = "", // default value
        description: string = "", // default value
        instructions: string = "", // default value
        ...args: any[]
    ) {
        super();
        
        this.model = model;
        this.role = role;
        this.temperature = temperature;
        this.maxTokens = maxTokens;
        this.topP = topP;
        this.presencePenalty = presencePenalty;
        this.frequencyPenalty = frequencyPenalty;
        
        // Assigning values to the properties
        this.name = name;
        this.description = description;
        this.instructions = instructions;
    }

    // The execute method is a placeholder that should be implemented by subclasses.
    // It throws an error by default, indicating that the method needs to be overridden.
    execute(instruction: string, ...args: any[]): any {
        throw new Error("Subclasses should implement the 'execute' method.");
    }
}
