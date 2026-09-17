document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");
    const weddingDate = document.getElementById("wedding-date");
    const dateUnknown = document.getElementById("date-unknown");
    const unknownDateValue = document.getElementById("wedding-date-unknown");
    const phone = form ? form.elements.phone : null;

    if (phone) {
        phone.addEventListener("input", function() {
            phone.value = phone.value.replace(/[^0-9]/g, "");
        });
    }

    if (weddingDate && dateUnknown && unknownDateValue) {
        dateUnknown.addEventListener("change", function() {
            weddingDate.disabled = dateUnknown.checked;
            weddingDate.required = !dateUnknown.checked;
            unknownDateValue.disabled = !dateUnknown.checked;
        });
    }

    if(form) {
        form.addEventListener("invalid", function(event) {
            const field = event.target;
            const fieldNames = {
                full_name: "Full name",
                phone: "Phone number",
                email: "Email address",
                wedding_date: "Wedding date"
            };
            let message = fieldNames[field.name] || "This field";

            if (field.validity.valueMissing) {
                message += " is required.";
            } else if (field.validity.typeMismatch) {
                message = "Please enter a valid email address.";
            } else if (field.validity.patternMismatch) {
                message = "Please enter a valid phone number.";
            }

            status.textContent = message;
            status.className = "error";
            status.style.color = "";
        }, true);

        form.addEventListener("input", function() {
            status.textContent = "";
            status.className = "";
            status.style.color = "";
        });

        form.addEventListener("reset", function() {
            if (weddingDate && dateUnknown && unknownDateValue) {
                weddingDate.disabled = false;
                weddingDate.required = true;
                unknownDateValue.disabled = true;
            }
        });

        form.addEventListener("submit", async function(event) {
            event.preventDefault();
            const data = new FormData(event.target);
            
            try {
                const response = await fetch(event.target.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                const result = await response.json().catch(() => ({}));

                if (response.ok) {
                    status.textContent = "Thanks! We'll be in touch soon.";
                    status.style.color = "#e2b808";
                    form.reset();
                } else {
                    const errors = result.errors || [];
                    status.textContent = errors.length
                        ? errors.map(error => error.message).join(" ")
                        : "Please check your email address and try again.";
                    status.className = "error";
                    status.style.color = "";
                }
            } catch (error) {
                status.textContent = "We couldn't submit the form. Please check your details and try again.";
                status.className = "error";
                status.style.color = "";
            }
        });
    }
});