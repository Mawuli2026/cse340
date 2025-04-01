document.addEventListener("DOMContentLoaded", () => {
    // Smooth Scrolling
    document.querySelectorAll("nav ul li").forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const sectionId = event.target.getAttribute("data-section");
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // Show More Reviews Toggle
    const showReviewsBtn = document.getElementById("show-reviews");
    const reviewsSection = document.getElementById("reviews");
    
    showReviewsBtn.addEventListener("click", () => {
        if (reviewsSection.style.display === "none" || !reviewsSection.style.display) {
            reviewsSection.style.display = "block";
            showReviewsBtn.textContent = "Hide Reviews";
        } else {
            reviewsSection.style.display = "none";
            showReviewsBtn.textContent = "Show Reviews";
        }
    });

    // Button Hover Effect
    document.querySelectorAll("button").forEach(button => {
        button.addEventListener("mouseenter", () => {
            button.style.transform = "scale(1.05)";
        });
        button.addEventListener("mouseleave", () => {
            button.style.transform = "scale(1)";
        });
    });
});

function toggleMenu() {
    document.getElementById("nav-menu").classList.toggle("active");
  }
  