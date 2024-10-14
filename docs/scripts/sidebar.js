export function initializeSideBar (){
     /* get the elements of the burger and the aside of the mobile phone */
 const openMenuBtn = document.querySelector('.openMenuBtn');
 const closeMenuBtn = document.querySelector('.closeMenu');
 const dropdown = document.querySelector('#sidebar');
 const searchModal = document.querySelector('.searchModal');
 const openSearchModalBtn = document.querySelector('.openSearchModalBtn');
 const closeSearchModalBtn = document.querySelector('.closeSearchModalBtn');

 /* SideBars */
 const desktopSidebar = document.querySelector('#desktopSidebar');
 const phoneSidebar = document.querySelector('#phoneSidebar');
 
 


/* Psuedo code for the hover states of svg of the menu items in the whole document. */
// Get all the anchor tags in both the desktop menu and phone menu items.
// Loop through all the tags adding 2 event listeners to them that is mouseover and mouseleave
// And in each of the listeners you will want to add the color desired to all the stroke attributes of the path elements in each svg 
const desktopMenuItems = document.querySelector('.desktopMenuItems');
let desktopAnchors = desktopSidebar.querySelectorAll('a');
let phoneAnchors = phoneSidebar.querySelectorAll('a');
const allAnchorTags = Array.from(desktopAnchors).concat(Array.from(phoneAnchors));
const sidebarSection = desktopSidebar.querySelectorAll('section');
const phoneSidebarSection = phoneSidebar.querySelectorAll('section');
const desktopSide = document.getElementById('desktopSidebar');
const phoneSections = Array.from(phoneSidebar.querySelector('.phoneMenu').children);
const phoneMenu = phoneSidebar.querySelector('.phoneMenu');
const homeLinks = document.querySelectorAll('.homeLink');

 /* Functions to call once the window has loaded */
    setCurrentPageIndicator(localStorage.getItem('activePage'));

    sidebarSection.forEach(section=>{
        let links = section.querySelectorAll('a');
        section.addEventListener('keydown', (event)=>{
            let parentElement = section.querySelector('div');

            if(event.key == "Enter"){
                if(event.target === section){
                    /* focus the first element */
                    section.querySelector('a').focus();
                
                    links.forEach(anchor=>{
                        anchor.setAttribute('tabindex', '0');
                    });
                }else{
                    reselectNavItem(Array.from(desktopAnchors), event.target, 'navSelected');
                    resetAnchorTags(allAnchorTags);
                    event.target.setAttribute('aria-selected', true);
                }
            
            }else if(event.key == "Escape"){ 
                links.forEach(anchor=>{
                    anchor.setAttribute('tabindex', '-1');
                });
                section.focus();
            }else if(event.key == "ArrowDown"){
                event.preventDefault();
                let nextItem = event.target.nextElementSibling || links[0];
                nextItem.focus();
            }else if(event.key == "ArrowUp"){
                event.preventDefault();
                let previousItem = event.target.previousElementSibling || links[links.length - 1];
                previousItem.focus();
            }

            trapFocus(event, parentElement.firstElementChild, parentElement.lastElementChild);
        });
        section.addEventListener('blur', ()=>{
            links.forEach(anchor=>{
                anchor.setAttribute('tabindex', '-1');
            });
        })
    });

    phoneSections.forEach(section=>{
        let links = section.querySelectorAll('a');

        section.addEventListener('keydown', (event)=>{
            let parentElement = section.querySelector('ul');
            let target = event.target;
            if(event.key == "Enter"){
            
                if(event.target == section){
                    /* focus the first element */
                    section.querySelector('a').focus();
                
                    links.forEach(anchor=>{
                        anchor.setAttribute('tabindex', '0');
                    });
                }//else if(target.tagName === "A"){

                //     let currentPage = event.currentTarget.getAttribute('data-page');
                //     localStorage.setItem('activePage', currentPage);
                //     reselectNavItem(allAnchorTags, document.querySelectorAll(`[data-page="${currentPage}"]`), 'navSelected');
                //     setCurrentPageIndicator(localStorage.getItem('activePage'));
                //     window.location.href  = event.currentTarget.href;
                    
                //  /*    reselectNavItem(Array.from(phoneAnchors), event.target, 'navSelected'); */
                // }
            
            }else if(event.key == "Escape"){
                if(target.tagName === "A") {
                    links.forEach(anchor=>{
                        anchor.setAttribute('tabindex', '-1');
                    });
                    section.focus();
                }else if (target.tagName === "SECTION"){
                    phoneMenu.focus();
                    phoneSections.forEach(section=>{
                        section.setAttribute('tabindex', '-1');
                    });
                }
                
            }else if(event.key == "ArrowDown"){
               /*  event.preventDefault(); */
                
                if(target.tagName === "A"){
                    let nextItem = target.parentElement.nextElementSibling;

                    if(target.parentElement.nextElementSibling){

                        nextItem = nextItem.firstElementChild;
                        nextItem.focus();
                    }else {
                        links[0].focus();
                    }
                    
                } else if(target.tagName === "SECTION"){
                    let nextItem = event.target.nextElementSibling || phoneSections[0];
                    nextItem.focus();
                }
                
            }else if(event.key == "ArrowUp"){
                event.preventDefault();
                if(target.tagName === "A"){
                    let previousItem = event.target.parentElement.previousElementSibling;

                    if(target.parentElement.previousElementSibling){

                        previousItem = previousItem.firstElementChild;
                        previousItem.focus();
                    }else {
                        links[links.length - 1].focus();
                    }
                }else if(target.tagName){
                    let previousItem = event.target.previousElementSibling || phoneSections[phoneSections.length - 1];
                    previousItem.focus();
                }
                
            }

            if(target.tagName === "A"){
                trapFocus(event, parentElement.firstElementChild.firstElementChild, parentElement.lastElementChild.firstElementChild);
            }else if(target.tagName === "SECTION"){
                trapFocus(event, phoneMenu.firstElementChild, phoneMenu.lastElementChild);
            }
            
        });
        section.addEventListener('blur', ()=>{
            links.forEach(anchor=>{
                anchor.setAttribute('tabindex', '-1');
            });
        })
    });

    phoneSidebar.addEventListener('keydown', (event)=>{
        const element1 = phoneSidebar.querySelector('.phoneMenu');
        const element2 = closeMenuBtn;
        const target = event.target;
        
        if(event.key == "Enter"){
            if(target.classList.contains('phoneMenu')){
                /* switch all the tabindexs to 1 */
                phoneSections.forEach(section=>{
                    section.setAttribute('tabindex', '0');
                });
                phoneSections[0].focus(); 
            }
        } else if (event.key == "ArrowRight"){
            event.preventDefault();
            const nextItem = document.activeElement === element1 ? element2 : element1;
            nextItem.focus(); 
        }else if(event.key === "ArrowLeft"){
            event.preventDefault();
            const nextItem = document.activeElement === element2 ? element1 : element2;
            nextItem.focus(); 
        }else if(event.key === "Escape"){
            if(target.tagName === "DIV"){
                phoneSections.forEach(section=>{
                    section.setAttribute('tabindex', '-1');
                });
                closeMenu();
                openMenuBtn.focus();    
            }
                            
            
        }
        
        trapFocus(event, element1, element2);
    });

    desktopSide.addEventListener('keydown', (event)=>{
        const children = Array.from(desktopSide.children);
        let logoOrSection = event.target.tagName === "SECTION" || event.target.classList.contains('logoLink');

        if(event.key == 'Enter'){
            if(event.target == desktopSide){
                desktopSide.firstElementChild.focus();

                children.forEach(child=>{
                    child.setAttribute('tabindex', '0');
                })
            }
            

            
        }else if(event.key == 'Escape'){
            children.forEach(child=>{
                child.setAttribute('tabindex', '-1');
            });

            if(logoOrSection){
                desktopSide.focus();
            }
            
        }else if(event.key == 'ArrowDown'){
            event.preventDefault();
            let nextItem = event.target.nextElementSibling || desktopSide.firstElementChild;

            if(logoOrSection){
                nextItem.focus();
            }
            
        }else if(event.key == "ArrowUp"){
            event.preventDefault();
            let previousItem = event.target.previousElementSibling || desktopSide.lastElementChild;

            if(logoOrSection){
                previousItem.focus();
            }
            
        }
        trapFocus(event, desktopSide.firstElementChild, desktopSide.lastElementChild);
    });
 
    /* Search Modal event Listeners */
    openSearchModalBtn.addEventListener('click',openSearchModal);
    closeSearchModalBtn.addEventListener('click', closeSearchModal);

    /* Sidebar event Listeners (Both phone and desktop)*/
    openMenuBtn.addEventListener('click', openMenu);
    closeMenuBtn.addEventListener('click', closeMenu);

 allAnchorTags.forEach(link=>{
    link.addEventListener('click', (event)=>{
        event.preventDefault();
        let clickedPageLink = event.currentTarget.getAttribute('data-page');
        localStorage.setItem('activePage', clickedPageLink);
        reselectNavItem(allAnchorTags, document.querySelectorAll(`[data-page="${clickedPageLink}"]`), 'navSelected');
        setCurrentPageIndicator(localStorage.getItem('activePage'));
        window.location.href  = event.currentTarget.href;
    });

 });
 
 homeLinks.forEach(homeLink=>{
    homeLink.addEventListener('click', (event)=>{
        event.preventDefault();
        let clickedPageLink = 'home';
        localStorage.setItem('activePage', clickedPageLink);
        reselectNavItem(allAnchorTags, document.querySelectorAll(`[data-page="${clickedPageLink}"]`), 'navSelected');
        setCurrentPageIndicator(localStorage.getItem('activePage'));
    })
 })

 /* Functions */
 function openMenu(){
    dropdown.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    phoneSidebar.querySelector('.phoneMenu').focus();
 }

 function closeMenu(){
    dropdown.classList.add('hidden');
    document.body.style.overflow = 'scroll';
    openMenuBtn.focus();
 }

 function openSearchModal(){
     searchModal.classList.remove('hidden'); 
 }
 
 function closeSearchModal() {
     searchModal.classList.add('hidden');
 }

 function addListenerToAnchorTags(tags){
    tags.forEach((anchorTag)=>{
        anchorTag.addEventListener('click', (event)=>{

            let link = event.target.closest('a');

            if(!link) return;

            reselectNavItem(Array.from(desktopAnchors), link, 'navSelected');
        })
     });
 }

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
 
 function colorizeSVG(svgElement){
    let svgChildren = Array.from(svgElement.children);

    svgChildren.forEach((svgChild)=>{
        if(svgChild.hasAttribute('stroke')){
            svgChild.setAttribute('stroke', '#FFB319');
        }else{
            return;
        }
    })

    return svgElement;
 }

 function decolorizeSVG(svgElement){
    let svgChildren = Array.from(svgElement.children);

    svgChildren.forEach((svgChild)=>{
        if(svgChild.hasAttribute('stroke')){
            svgChild.setAttribute('stroke', '#FFFFFF');
        }else{
            return;
        }
    })
    return svgElement;
 }

 function reselectNavItem(listOfItems, itemsSelected, selectClass){
    listOfItems = listOfItems.filter(item=>{
        if(item.classList.contains(selectClass)){
            return true;
        }
    })
    listOfItems.forEach(item=>{
        item.classList.remove(selectClass);

            if(item.querySelector('svg')){
                decolorizeSVG(item.querySelector('svg'))
            }
    })

    itemsSelected.forEach(item=>{
        item.classList.add(selectClass);
        if (item.querySelector('svg')) {
            colorizeSVG(item.querySelector('svg'));
        }
    })
 }

 function resetAnchorTags(anchorTags){
    anchorTags.forEach(anchor=>{
        anchor.setAttribute('aria-selected', false);
    });
 }

 function setCurrentPageIndicator(currentPage){
    let currentPageLinks = allAnchorTags.filter(item=>{
        if(item.hasAttribute('data-page') && (item.getAttribute('data-page') === currentPage)){
            return true;
        }
    })
    
    resetAnchorTags(allAnchorTags);

    //get the link which is active and add the necessary classes to it and show it on the screen
    currentPageLinks.forEach(link=>{
        link.setAttribute('aria-selected', true);
        link.classList.add('navSelected');
    })

 }
}
