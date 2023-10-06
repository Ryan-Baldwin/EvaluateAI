"use client"
// pages/extract-text.tsx
import { useState } from 'react';
import { useStore } from './store'; // Import the Zustand store
import { Sidebar } from "@/components/sidebar"


export default function ExtractText() {
    const { text, categories, rawResults, cleanedResults, viewResults, setText, setCategories, setRawResults, setCleanedResults, setRawView, setCleanedView } = useStore();

    const handleAddCategory = () => {
        const newCategories = [...categories, ''];
        setCategories(newCategories);
    };

    const handleRemoveCategory = (index: number) => {
        const newCategories = categories.filter((_, i) => i !== index);
        setCategories(newCategories);
    };

    const handleCategoryChange = (value: string, index: number) => {
        const newCategories = [...categories];
        newCategories[index] = value;
        setCategories(newCategories);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newResults: { [key: string]: string[] } = {};

        for (const category of categories) {
            const response = await fetch('/api/ai/extract', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    category,
                }),
            });

            const data = await response.json();
            newResults[category] = data.content.split(', ');
        }

        setRawResults(newResults);

        // Clean the data
        const cleanedResponse = await fetch('/api/ai/clean', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newResults),
        });

        const cleanedData = await cleanedResponse.json();
        setCleanedResults(cleanedData);
    };

    const handleDownload = () => {
        const dataToSave = {
            text: text,
            categories: categories,
            responses: viewResults === 'cleaned' ? cleanedResults : rawResults
        };

        const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'data.json';
        link.click();
        URL.revokeObjectURL(link.href);
    };

    return (
        <div className="flex">
            <Sidebar className="hidden lg:block" />
            <div className="lg:col-span-9 w-3/4 p-4">
                <h1>Text Extraction</h1>
                <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2">Text:</label>
                    <textarea 
                        value={text} 
                        onChange={(e) => setText(e.target.value)} 
                        required 
                        className="w-full h-60 p-2 border rounded"
                    ></textarea>
                </div>

                {categories.map((category, index) => (
                    <div key={index} className="mb-4">
                        <label className="block mb-2">Category {index + 1}:</label>
                        <input 
                            type="text" 
                            value={category} 
                            onChange={(e) => handleCategoryChange(e.target.value, index)} 
                            required 
                            className="w-full p-2 border rounded mb-2"
                        />
                        <button type="button" onClick={() => handleRemoveCategory(index)}>Remove</button>
                    </div>
                ))}

                <button type="button" onClick={handleAddCategory}>Add Category</button>
                <button type="submit" className="p-2 bg-blue-500 text-white rounded ml-4">Extract</button>
            </form>

                <button onClick={handleDownload}>Download Data</button>
                <button onClick={setRawView}>View Raw</button>
                <button onClick={setCleanedView}>View Cleaned</button>

                {viewResults === 'raw' ? (
                    Object.entries(rawResults).map(([category, names], index) => (
                        <div key={index} className="mt-4">
                            <h2>Extracted Information for {category}:</h2>
                            <ul>
                                {names.map((name, idx) => (
                                    <li key={idx}>{name}</li>
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    Object.entries(cleanedResults).map(([category, names], index) => (
                        <div key={index} className="mt-4">
                            <h2>Extracted Information for {category}:</h2>
                            <ul>
                                {names.map((name, idx) => (
                                    <li key={idx}>{name}</li>
                                ))}
                            </ul>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}