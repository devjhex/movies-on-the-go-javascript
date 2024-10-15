
export function initializeSearchBar(){
    
    const searchInput = document.querySelectorAll('.search-bar');
    const searchButton = document.querySelectorAll('.search-button');
    const searchContainers = document.querySelectorAll('.search-container');
    
        searchButton.forEach(button=>{
            button.addEventListener('click', (event)=>{
                let button = event.currentTarget.closest('button');
                if(button){
                let input = button.parentElement.querySelector('.search-bar');
                const query = input.value.trim();
                if(query){
                    const baseURL = `${window.location.protocol}//${window.location.host}`;

                    if(window.location.host.includes('localhost') || window.location.hostname === "127.0.0.1"){
                        window.location.href = `${baseURL}/docs/search.html?query=${encodeURIComponent(query)}`;
                    }else {
                        window.location.href = `${baseURL}/search.html?query=${encodeURIComponent(query)}`;
                    }
    
                    
    
                } 
                else {
                    console.log("No query is defined in the search bar.");
                }
                }
            });
        });

        searchContainers.forEach((container)=>{
            container.addEventListener('keydown', event=>{
                
                let elements = event.currentTarget.querySelectorAll('.focusable');

                trapFocus(event, elements[0], elements[elements.length - 1]);

                if(elements.length > 0 && event.key === "Enter"){
                    elements.forEach(element=>{
                        element.setAttribute('tabindex', 0);
                    });

                    elements[0].focus();
                   
                }else if (event.key === "Escape"){
                    elements.forEach(element=>{
                        element.setAttribute('tabindex', -1);
                    })
                    event.currentTarget.focus();
                }
            })
        })

        searchInput.forEach(input=>{
            input.addEventListener('keydown', (event)=>{
                let query = event.currentTarget.value.trim();

                if(query){
                    if (event.key === "Enter") {
                        const baseURL = `${window.location.protocol}//${window.location.host}`;
        
                    if(window.location.host.includes('localhost') || window.location.hostname === "127.0.0.1"){
                        window.location.href = `${baseURL}/docs/search.html?query=${encodeURIComponent(query)}`;
                    }else {
                        window.location.href = `${baseURL}/search.html?query=${encodeURIComponent(query)}`;
                    }
                    }
                }else {
                    return;
                }
            
            })
        })

        function trapFocus(event, firstFocusableElement, lastFocusableElement){
    
            if(event.key === 'Tab' &&  !event.shiftKey){
                //if the user presses the tab key without the shift key and the last focusable element is focused focus the first element.
        
                if(document.activeElement === lastFocusableElement) {
                    event.preventDefault();
        
                    firstFocusableElement.focus();
                }
            } else if(event.key === 'Tab' && event.shiftKey){
                //if the user presses the tab key with the shift key and the first focusable element is focused focus the last focusable element.
                if(document.activeElement === firstFocusableElement) {
                    event.preventDefault();
        
                    lastFocusableElement.focus();
                }
            }else {
                return;
            }
         }
}