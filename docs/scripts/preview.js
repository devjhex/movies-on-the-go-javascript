export function initializePreview () {
  const previewContainer = document.querySelector(".preview-container");
  let currentIndex = 0;
  let slides;
  let totalSlides ;
  const transitionDuration = 1000;
  const displayDuration = 5000;

  function displayMovies() {

      previewContainer.innerHTML = movies
        .map((movie, index) => {
          return `<div class="preview-slide text-white border w-full h-full top-0 absolute flex transition-all duration-[1s]" style="background-color:${movies[index]}; opacity:0">
          <p>hello  world how are you doing</p>
      </div>`;
        })
        .join("");

        slides = Array.from(previewContainer.querySelectorAll(".preview-slide"));
        totalSlides = slides.length;
        console.log(slides);

       setInitialSlide();
      
  }

  function startSlideShow() {
   
        setInterval(()=>{
          fadeOutSlide(currentIndex);
        }, displayDuration + transitionDuration);
  } 

  function setInitialSlide() {
    setTimeout(()=>{
      previewContainer.firstElementChild.classList.add('animate-fadeIn');
    }, transitionDuration);
  }

  function fadeOutSlide(index){
    //first fade out the first slide to black.
    slides[index].classList.remove('animate-fadeIn');

    slides[index].classList.add('animate-fadeOut');

    //Update the current Index of the slides.
    currentIndex = (currentIndex + 1) % totalSlides;

    setTimeout(()=>{
      fadeInSlide(currentIndex);
    }, transitionDuration);
  }

  function fadeInSlide(index){
    slides[index].classList.remove('animate-fadeOut');

    slides[index].classList.add('animate-fadeIn');
  }
  

}


