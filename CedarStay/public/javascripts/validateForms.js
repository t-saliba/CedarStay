    // Example starter JavaScript for disabling form submissions if there are invalid fields
    (function () {
        'use strict'
      
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        const forms = document.querySelectorAll('.validated-form')
      
        // Loop over them and prevent submission
        Array.from(forms)   //make an array of this forms.
          .forEach(function (form) {     //loop over them with for each
            form.addEventListener('submit', function (event) {
              if (!form.checkValidity()) {               //if not valid prevent submission
                event.preventDefault()
                event.stopPropagation()
              }
      
              form.classList.add('was-validated')
            }, false)
          })
      })()