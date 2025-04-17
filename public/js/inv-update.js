const form = document.querySelector("#updateForm")

// Enable the button when form changes
form.addEventListener("change", function () {
  const updateBtn = form.querySelector('button[type="submit"]')
  updateBtn.removeAttribute("disabled")
})

// Optional: confirmation before submitting
form.addEventListener("submit", function (e) {
  const confirmed = confirm("Are you sure you want to update this vehicle?")
  if (!confirmed) {
    e.preventDefault()
  }
})
