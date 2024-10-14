import { trapFocus } from "../pageScripts/index.js";
export function initializeFooter() {
    const footerParent = document.querySelector('footer');
    let allFooterLinks = Array.from(footerParent.querySelectorAll('a'));

    footerParent.addEventListener('keydown', (event)=>{

        if(event.key === "Enter"){
            if(event.target === footerParent) {
                allFooterLinks.forEach(link=>{
                    link.setAttribute('tabindex', '0');
                });
    
                allFooterLinks[0].focus();
            }
        }
        trapFocus(event, allFooterLinks[0], allFooterLinks[allFooterLinks.length - 1]);
    });

    allFooterLinks.forEach(link=>{
        link.addEventListener('keydown', (event)=>{
            if(event.key === "Escape"){
                allFooterLinks.forEach(link=>{
                    link.setAttribute('tabindex', '-1');
                });
                footerParent.focus();
            }
    })
    });

}