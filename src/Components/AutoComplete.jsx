import React, { useState } from 'react';
import { extract, token_sort_ratio } from 'fuzzball';

const locations = [
    'Downtown',
    'City Center',
    'North Park',
    'East Side Mall',
    'West End',
    'Central Station',
    'South Plaza',
    'Tech Hub',
    'Greenwood',
    'Museum District',
    // Add more locations as needed
];

const AutoCompleteInput = () => {
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [sourceSuggestions, setSourceSuggestions] = useState([]);
    const [destinationSuggestions, setDestinationSuggestions] = useState([]);

    const handleSourceChange = (e) => {
        const input = e.target.value;
        setSource(input);

        if (input) {
            const matches = extract(input, locations, { limit: 5, scorer: token_sort_ratio });
            setSourceSuggestions(matches.map(match => match[0]));
        } else {
            setSourceSuggestions([]);
        }
    };

    const handleDestinationChange = (e) => {
        const input = e.target.value;
        setDestination(input);

        if (input) {
            const matches = extract(input, locations, { limit: 5, scorer: token_sort_ratio });
            setDestinationSuggestions(matches.map(match => match[0]));
        } else {
            setDestinationSuggestions([]);
        }
    };

    const handleSourceSelect = (suggestion) => {
        setSource(suggestion);
        setSourceSuggestions([]);
    };

    const handleDestinationSelect = (suggestion) => {
        setDestination(suggestion);
        setDestinationSuggestions([]);
    };

    return (
        <div className="p-4">
            <div className="mb-6">
                <label htmlFor="source" className="block text-gray-700">Source</label>
                <input
                    id="source"
                    type="text"
                    value={source}
                    onChange={handleSourceChange}
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="Enter source location"
                />
                {sourceSuggestions.length > 0 && (
                    <ul className="border rounded-md mt-2 bg-white">
                        {sourceSuggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                onClick={() => handleSourceSelect(suggestion)}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="mb-6">
                <label htmlFor="destination" className="block text-gray-700">Destination</label>
                <input
                    id="destination"
                    type="text"
                    value={destination}
                    onChange={handleDestinationChange}
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="Enter destination location"
                />
                {destinationSuggestions.length > 0 && (
                    <ul className="border rounded-md mt-2 bg-white">
                        {destinationSuggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                onClick={() => handleDestinationSelect(suggestion)}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AutoCompleteInput;
