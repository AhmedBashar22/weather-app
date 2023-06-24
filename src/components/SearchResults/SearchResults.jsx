const SearchResults = ({ className = "", searchResults = [], displayFunction = (searchResult, index) => "Search result", selectionFunction = (selection, index) => console.log(index, selection), exitButton }) => {
  return (
    <div className={`search-results ${className}`}>
      {<>{exitButton}</>}
      <ul className="search-results-list">
        {searchResults.map((item, n) => {
          return <li className="search-result"><button className="search-result-button" onClick={() => selectionFunction(item, n)}>{displayFunction(item, n)}</button></li>
        })}
      </ul>
    </div>
  );
}
 
export default SearchResults;