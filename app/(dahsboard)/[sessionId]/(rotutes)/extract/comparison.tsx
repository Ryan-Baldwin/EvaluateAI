// pages/extract-text.tsx
import { useState } from 'react';
import { useStore } from './store'; // Import the Zustand store
import { Sidebar } from "@/components/sidebar";



export default function ExtractText() {
    const { text, categories, rawResults, cleanedResults, setText, setCategories, setRawResults, setCleanedResults } = useStore(); // Use the Zustand store
    const [viewCleaned, setViewCleaned] = useState(true); // State to toggle between raw and cleaned views
 
    
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
        setCategories(newCategories); // Update the Zustand store
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const rawResults: { [key: string]: string[] } = {};

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
            rawResults[category] = data.content.split(', ');
        }

        setRawResults(rawResults); // Store raw results in Zustand store

        // Send the raw results to the cleaning API
        const cleanedResponse = await fetch('/api/ai/cleanResponse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ responses: rawResults }),
        }).then(res => res.json());

        setCleanedResults(cleanedResponse.responses); // Store cleaned results in Zustand store
    };

    const handleDownload = () => {
        const dataToSave = {
            text: text,
            categories: categories,
            responses: viewCleaned ? cleanedResults : rawResults
        };

        const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'data.json';
        link.click();
        URL.revokeObjectURL(link.href);
    };
  
    return (
        <div className="hidden md:block">

            <div className="border-t">
                <div className="bg-background">
                    <div className="grid lg:grid-cols-5">
                    <Sidebar className="hidden lg:block" />
                    <div className="col-span-3 lg:col-span-4 lg:border-l">
                        <div className="h-full px-4 py-6 lg:px-8">


                            <div className="lg:col-span-9 w-full p-4">
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
                                        placeholder={category} // Use the exampleCriteria as placeholders
                                        />
                                        <button type="button" onClick={() => handleRemoveCategory(index)}>Remove</button>
                                    </div>
                                    ))}
                        
                                    <button type="button" onClick={handleAddCategory}>Add Category</button>
                                    <button type="submit" className="p-2 bg-blue-500 text-white rounded ml-4">Extract</button>
                                </form>
                    
                                <div className="mt-8">
                                    <h2 className="text-xl font-bold mb-4">Extraction Results</h2>
                                    <table className="min-w-full bg-white">
                                        <thead>
                                            <tr>
                                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm uppercase font-semibold text-gray-600">Category</th>
                                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm uppercase font-semibold text-gray-600">Extracted Information</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(results).map(([category, names], index) => (
                                                <tr key={index}>
                                                    <td className="py-2 px-4 border-b border-gray-200 text-sm">{category}</td>
                                                    <td className="py-2 px-4 border-b border-gray-200 text-sm">{names.join(', ')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                 <button onClick={handleDownload} className="p-2 bg-blue-500 text-white rounded ml-4">Download JSON</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>        
      </div>
    );
  }

  return (
    <div className="flex">
        <Sidebar className="hidden lg:block w-1/4" />
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

            <div className="mt-4">
                <button onClick={() => toggleView()} className="p-2 bg-yellow-500 text-white rounded">
                    {viewResults === 'cleaned' ? "View Raw Results" : "View Cleaned Results"}
                </button>
                <button onClick={handleDownload} className="p-2 bg-green-500 text-white rounded ml-4">Download Data</button>
            </div>

            {Object.entries(viewResults === 'cleaned' ? cleanedResults : rawResults).map(([category, names], index) => (
                <div key={index} className="mt-4">
                    <h2>Extracted Information for {category}:</h2>
                    <ul>
                        {names.map((name, idx) => (
                            <li key={idx}>{name}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    </div>
);
}

