import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <Form inline onSubmit={handleSearch}>
            <Form.Control
                type="text"
                placeholder="Search locations"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary ml-2">Search</button>
        </Form>
    );
};

export default SearchBar;