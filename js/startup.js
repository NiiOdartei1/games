setTimeout(() => {
    document.getElementById("startup-screen").classList.add("hidden");
    document.getElementById("game-container").classList.remove("hidden"); // Show game elements
  }, 1000); // Change to 1 second for testing
  