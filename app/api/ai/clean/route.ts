// pages/api/cleanResponse.ts

import type { NextApiRequest, NextApiResponse } from 'next';

function cleanResponses(responses: { [key: string]: string[] }): { [key: string]: string[] } {
    const cleanedResponses: { [key: string]: string[] } = {};

    for (const [category, values] of Object.entries(responses)) {
        cleanedResponses[category] = values.map(value => {
            // Remove the category name and other unwanted characters from the string
            const cleanedValue = value.replace(`"${category}": [`, '').replace('"]', '').replace(/\"/g, '');
            return cleanedValue;
        });
    }

    return cleanedResponses;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const rawResponses = req.body.responses;
        const cleanedData = {
            categories: Object.keys(rawResponses),
            responses: cleanResponses(rawResponses)
        };
        res.status(200).json(cleanedData);
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
