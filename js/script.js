document.addEventListener("DOMContentLoaded", function() {
    console.log("Website Loaded Successfully!");

    // Smooth Scrolling for Navigation
    document.querySelectorAll("nav ul li a").forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);
            window.scrollTo({
                top: targetElement.offsetTop - 50,
                behavior: "smooth"
            });
        });
    });

    // Scroll Reveal Effect
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("fade-in");
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(section => {
        observer.observe(section);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const scrollToButtons = document.querySelectorAll(".scroll-to");
    
    scrollToButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = button.getAttribute("href").substring(1); // Extract target section ID
            const targetElement = document.getElementById(targetId);

            window.scrollTo({
                top: targetElement.offsetTop - 50, // Adjust for any fixed header
                behavior: "smooth",
            });
        });
    });
});
