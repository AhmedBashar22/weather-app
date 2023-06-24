import { useCallback, useEffect, useRef, useState } from "react";

// React component that displays a search bar with autocomplete suggestions.
//
// Usage:
// - Import the Searchbar component.
// - Include the component in your JSX code, passing in the autocomplete and submit functions.
//
// Props:
// - className: CSS class name for the form element
// - placeholder: Placeholder text for the search input field
// - autocompleteFunction: Function to fetch autocomplete suggestions (should return a Promise that resolves to an array of suggestion strings)
// - loadingMessage: Message to display while waiting for suggestions to load
// - submitFunction: Function to handle form submissions (takes in the search query value)
// - submitButtonContent: Text content for the submit button

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const Searchbar = ({
  className = "",
  placeholder = "",
  autocompleteFunction = async (value, abortSignal) => [],
  loadingMessage = "Loading...",
  submitFunction = value => console.log(value),
  submitButtonContent = "Search",
  debounceTime = 0
}) => {
  const [autocompleteArray, setAutocompleteArray] = useState([]); // State to hold autocomplete suggestions
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  const textboxRef = useRef(null); // Ref to the search input field
  const formRef = useRef(null); // Ref to the form element
  const autocompleteListRef = useRef(null); // Ref to the div element that displays autocomplete suggestions
  const abortController = useRef(null)

  const fetchAutocomplete = useCallback((value) => {
    setIsLoading(true)
    abortController.current?.abort()
    let controller = new AbortController()
    abortController.current = controller
    sleep(debounceTime).then(() => {
      autocompleteFunction(value, controller.signal)
      .then(value => {
        if (!controller.signal.aborted) setAutocompleteArray(value)
      })
      .finally(() =>{
        if (abortController.current === controller) {
          abortController.current = null
        }
        setIsLoading(false)
      })
    })
  }, [autocompleteFunction, debounceTime])

  useEffect(() => {
    const textbox = textboxRef.current

    const handleInput = (e) => {
      e.stopPropagation()
      fetchAutocomplete(textbox.value)
    }

    textbox.addEventListener("input", handleInput)

    return () => {
      textbox.removeEventListener("input", handleInput)
      abortController.current?.abort()
      abortController.current = null
    }
  }, [submitFunction])

  useEffect(() => {
    const form = formRef.current
    const textbox = textboxRef.current

    const handleSubmit = (e) => {
      e.preventDefault()
      e.stopPropagation()

      if (textbox.value !== "") {
        submitFunction(textbox.value)
        textbox.value = ""
        setAutocompleteArray([])
        textbox.dispatchEvent(new Event("input"))
      }
    }

    form.addEventListener("submit", handleSubmit)

    return () => {
      form.removeEventListener("submit", handleSubmit)
    }
  }, [submitFunction])

  useEffect(() => {
    if (autocompleteArray.length > 0) {
      const autocompleteList = autocompleteListRef.current;
      const autocompleteOptions = autocompleteList?.childNodes;
      const textbox = textboxRef.current;

      // Add click event listener to each autocomplete suggestion
      if (autocompleteOptions) {
        for (var i = 0; i < autocompleteOptions.length; i++) {
          autocompleteOptions[i].addEventListener("click", (e) => {
            textbox.value = e.target.innerText;
            textbox.dispatchEvent(new Event("input")); // Trigger input event to update suggestions
          });
        }
      }
    }
  }, [autocompleteArray]);

  return (
    <form ref={formRef} className={`searchbar ${className}`}>
      <input ref={textboxRef} type="search" placeholder={placeholder} className="search-input" />
      <button type="submit" className="submit-button">{submitButtonContent}</button>
      <div data-test="autocompleteDiv" className="autocomplete-container">
        {!(isLoading) && autocompleteArray && (autocompleteArray.length !== 0) && (
          <ul ref={autocompleteListRef} className="autocomplete-list">
            {autocompleteArray.map((i, n) => (
              <li key={n} className="autocomplete-option">{i}</li>
            ))}
          </ul>
        )}
        {isLoading && <div className="loading-message">{loadingMessage}</div>}
      </div>
    </form>
  );
};

export default Searchbar;