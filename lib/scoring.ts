import fs from 'fs';
import { Entity } from './entity';
import { Tool, ToolClass } from './tool';
import { Agent } from './agent';


class Scoring {
    /**
     * This is the class we use to score prompts
     */

    static getCategoriesDataDict(jsonFile: string): { [key: string]: any } {
        const categoryDataDict: { [key: string]: any } = {};
        const data = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));

        data.data.forEach((categoryData: any) => {
            const category = categoryData.category;
            const items = categoryData.items.map((item: any) => item.name);
            const example = categoryData.example;
            categoryDataDict[category] = { items, example };
        });

        return categoryDataDict;
    }

    static getCategoryItems(jsonFile: string): { [key: string]: any } {
        const categoryItems: { [key: string]: any } = {};
        const data = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));

        data.data.forEach((categoryData: any) => {
            const category = categoryData.category;
            const items = categoryData.items.map((item: any) => item.name);
            categoryItems[category] = items;
        });

        return { categoryItems, patterns: data.patterns };
    }

    //done
    static getCategoryItemsAndPatterns(jsonFile: string): any[] {
        const categoryItems: { [key: string]: any } = {};
        const categoryScores: { [key: string]: any } = {};
        const data = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));

        data.data.forEach((categoryData: any) => {
            const category = categoryData.category;
            const items = categoryData.items.map((item: any) => item.name);
            const scores = categoryData.items.reduce((acc: any, item: any) => {
                acc[item.name] = item.score;
                return acc;
            }, {});
            categoryItems[category] = items;
            categoryScores[category] = scores;
        });

        return [categoryItems, categoryScores, data.patterns];
    }

    //done
    static getExtractedItems(jsonFile: string, response: string): { [key: string]: any } {
        const categoryDataDict: { [key: string]: any } = {};
        const data = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));

        data.data.forEach((categoryData: any) => {
            const category = categoryData.category;
            const items = categoryData.items.map((item: any) => item.name);
            const example = categoryData.example;
            categoryDataDict[category] = { items, example };
        });

        const extractedItems: { [key: string]: any } = {};

        for (const [category, data] of Object.entries(categoryDataDict)) {
            const items = data.items;
            const example = data.example;

            // Assuming agent.actions is a method available in your environment
            const itemsFoundStr = Agent.actions(`Review the following text. Identify all the ${category} in the text below. \nText:${response}. 
            \n\nUse the following Example as a reference when identifying the ${category}: ${example}\n\nProvide your response ONLY as a dictionary list: 'category': ['name', 'name']`);

            const itemsFoundMatch = itemsFoundStr.match(/\[([^\]]+)\]/);
            let itemsFound: string[] = [];

            if (itemsFoundMatch) {
                itemsFound = itemsFoundMatch[1].replace(/'/g, '').split(', ').map(item => item.trim().toLowerCase());
            }

            extractedItems[category] = itemsFound;
        }

        return extractedItems;
    }

    //done
    static getExtractedItemsOverinclusive(jsonFile: string, response: string): { [key: string]: any } {
        const data = JSON.parse(fs.readFileSync(jsonFile, 'utf-8')).data;
        const extractedItems: { [key: string]: any } = {};

        data.forEach((categoryData: any) => {
            const category = categoryData.category;
            const example = categoryData.example;
            const items = categoryData.items;
            const itemsFoundInCategory: string[] = [];

            items.forEach((itemData: any) => {
                const itemName = itemData.name;
                const itemsFoundInCategoryStr = itemsFoundInCategory.join(', ');

                const itemFoundStr = agent.actions(`review the text below. Identify all ${category}. 
                Use the following Example as a reference when identifying the ${category}. Example: ${example}
                Text:${response}. 
                Be especially aware and be sure to correctly identify the ${category} of ${itemName}. 
                Provide your response ONLY as a dictionary list: 'category': ['name', 'name']
                You've identified the following ${category}: ${itemsFoundInCategoryStr} if there are no new ${category} return an empty string`);

                const itemsFoundMatch = itemFoundStr.match(/\[([^\]]+)\]/);
                if (itemsFoundMatch) {
                    const itemsFound = itemsFoundMatch[1].replace(/'/g, '').split(', ').map(item => item.trim().toLowerCase());
                    itemsFoundInCategory.push(...itemsFound);
                }
            });

            extractedItems[category] = itemsFoundInCategory;
        });

        return extractedItems;
    }

    //done 
    static applyPatterns(text: string, patterns: any[]): string {
        for (const patternData of patterns) {
            const pattern = new RegExp(patternData.pattern, 'i');
            if (pattern.test(text)) {
                return patternData.text;
            }
        }
        return text;
    }

    //done
    static extractionMatrix(extractedItems: { [key: string]: any }): { [key: string]: { [key: string]: number } } {
        const matrix: { [key: string]: { [key: string]: number } } = {};
    
        for (const [category, items] of Object.entries(extractedItems)) {
            matrix[category] = {};
            items.forEach((item: string) => {
                matrix[category][item] = 1;
            });
        }
    
        return matrix;
    }
    
    //done
    static scoreMatrix(categoryItems: { [key: string]: any }): { [key: string]: { [key: string]: number } } {
        const matrix: { [key: string]: { [key: string]: number } } = {};
    
        for (const [category, items] of Object.entries(categoryItems)) {
            matrix[category] = {};
            items.forEach((item: string) => {
                matrix[category][item] = 1;
            });
        }
    
        return matrix;
    }

    //done
    static multiplyAndScore(extractedMatrix: { [key: string]: { [key: string]: number } }, rubricMatrix: { [key: string]: { [key: string]: number } }): number {
        let score = 0;
    
        for (const category in extractedMatrix) {
            for (const item in extractedMatrix[category]) {
                if (rubricMatrix[category] && rubricMatrix[category][item]) {
                    score += extractedMatrix[category][item] * rubricMatrix[category][item];
                }
            }
        }
    
        return score;
    }

    static extractedJson(extractedItems: { [key: string]: any }): string {
        // Convert the extracted items to a matrix
        const matrix = Scoring.extractionMatrix(extractedItems);
        return JSON.stringify(matrix);
    }
    
    //done
    getMatrixs(response: string, jsonFile: string): any[] {
        const categoryDataDict = Scoring.getCategoriesDataDict(jsonFile);
        const categoryItems = Scoring.getCategoryItems(jsonFile);
        const extractedItems = Scoring.getExtractedItems(categoryDataDict, response);

        const extractedItemsMatrix = Scoring.extractionMatrix(extractedItems);
        const scoringRubricMatrix = Scoring.scoreMatrix(categoryItems);

        return [scoringRubricMatrix, extractedItemsMatrix];
    }

    // done
    runre(response: string, jsonFile: string): number {
        const categoryDataDict = Scoring.getCategoriesDataDict(jsonFile);
        const categoryItems = Scoring.getCategoryItems(jsonFile);
        const extractedItems = Scoring.getExtractedItems(jsonFile, response);

        const extractedItemsMatrix = Scoring.extractionMatrix(extractedItems);
        const scoringRubricMatrix = Scoring.scoreMatrix(categoryItems);

        let totalScore = 0;

        for (const category in extractedItemsMatrix) {
            const extractedMatrix = extractedItemsMatrix[category];
            const rubricMatrix = scoringRubricMatrix[category];

            const score = Scoring.multiplyAndScore(extractedMatrix, rubricMatrix);
            totalScore += score;
            console.log(`Score for ${category}: ${score}`);
        }

        console.log(`Total score: ${totalScore}`);
        return totalScore;
    }
    
    static evaluateExtractedItems(
        extractedItems: { [key: string]: any },
        categoryItems: { [key: string]: any },
        categoryScores: { [key: string]: any },
        patterns: any[]
    ): any {
        const matchedItems: { [key: string]: any } = {};
        const missingItems: { [key: string]: any } = {};
        const nonStandard: { [key: string]: any } = {};
        let totalScore = 0;
        const scoresByCategory: { [key: string]: any } = {};
        const scoresByItem: { [key: string]: any } = {};
    
        for (const category in categoryItems) {
            matchedItems[category] = [];
            missingItems[category] = [];
            nonStandard[category] = [];
            let categoryScore = 0;
            scoresByItem[category] = {};
    
            categoryItems[category].forEach((item: string) => {
                const itemPattern = Scoring.applyPatterns(item, patterns);
    
                if (extractedItems[category].some((extractedItem: string) => itemPattern === Scoring.applyPatterns(extractedItem, patterns))) {
                    matchedItems[category].push(item);
                    const itemScore = categoryScores[category][item];
                    categoryScore += itemScore;
                    scoresByItem[category][item] = itemScore;
                } else {
                    missingItems[category].push(item);
                }
            });
    
            extractedItems[category].forEach((extractedItem: string) => {
                if (!categoryItems[category].some((item: string) => Scoring.applyPatterns(extractedItem, patterns) === Scoring.applyPatterns(item, patterns))) {
                    nonStandard[category].push(extractedItem);
                }
            });
    
            totalScore += categoryScore;
            scoresByCategory[category] = categoryScore;
        }
    
        return {
            matchedItems,
            missingItems,
            nonStandard,
            totalScore,
            scoresByCategory,
            scoresByItem
        };
    }
    
    run(response: string, jsonFile: string): string {
        const categoryDataDict = Scoring.getCategoriesDataDict(jsonFile);
        const categoryItems = Scoring.getCategoryItems(jsonFile);
        const extractedItems = Scoring.getExtractedItems(jsonFile, response);
    
        const extractedItemsMatrix: { [key: string]: { [key: string]: number } } = Scoring.extractionMatrix(extractedItems);
        const scoringRubricMatrix: { [key: string]: { [key: string]: number } } = Scoring.scoreMatrix(categoryItems);
    
        let totalScore = 0;
        const categoryScores: { [key: string]: number } = {};
    
        for (const category in extractedItemsMatrix) {
            const extractedMatrix: { [key: string]: number } = extractedItemsMatrix[category];
            const rubricMatrix: { [key: string]: number } = scoringRubricMatrix[category];
    
            const score = Scoring.multiplyAndScore(extractedMatrix, rubricMatrix);
            totalScore += score;
            categoryScores[category] = score;
            console.log(`Score for ${category}: ${score}`);
        }
    
        console.log(`Total score: ${totalScore}`);
    
        const result = {
            totalScore: totalScore,
            categoryScores: categoryScores
        };
    
        return JSON.stringify(result, null, 2);
    }
    
    }
    
    
    static evaluateResults(response: string, standardFile: string): any {
        const [categoryItems, categoryScores, patterns] = Scoring.getCategoryItemsAndPatterns(standardFile);
        const extractedItems = Scoring.getExtractedItems(standardFile, response);
        const evaluationResults = Scoring.evaluateExtractedItems(extractedItems, categoryItems, categoryScores, patterns);
        return evaluationResults;
    }
    

}
