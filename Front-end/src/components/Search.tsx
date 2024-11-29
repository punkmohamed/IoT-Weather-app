import { useState } from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';
type SearchProps = {
    theme: string,
    handleSearch: (type: string) => void
    setSelectedState: (type: string) => void
}
const Search = ({ theme, handleSearch, setSelectedState }: SearchProps) => {
    const [search, setSearch] = useState<string>('');
    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && search.trim()) {
            handleSearch(search);
            setSelectedState(search)
            setSearch('')
        }
    };
    const handleButtonClick = () => {
        if (search.trim()) {
            handleSearch(search);
            setSelectedState(search)
            setSearch('')
        }
    };
    return (
        <>
            <Input value={search} onKeyPress={handleKeyPress} onChange={(e) => setSearch(e.target.value)} type="search" placeholder="Search...." className={` ${theme === 'light' && 'bg-white text-black'}`} />
            <Button type="button" onClick={handleButtonClick} className={` ${theme === 'light' && 'bg-white text-black hover:bg-yellow-400'}`} >Search</Button>
        </>
    )
}

export default Search