document.addEventListener('DOMContentLoaded', function(){
    // form validation 
    const forms = document.querySelectorAll('.custom__form');
    forms.forEach(form => {
        form.addEventListener('submit', formSend);
        async function formSend(e) {
            e.preventDefault();
            let error = formValidate(form); 
            if (error !== 0) {
                // Поля не заполнены
            } else {
                // 'Успешно отправлено!'
                form.reset();
                form.querySelectorAll('._req').forEach(f => {
                    if (f.classList.contains('active')) {
                        f.classList.remove('active');
                    }
                });
                window.location.href = 'success.html';
            }
        }
        function formValidate(form) {
            let error = 0;
            let formReq = form.querySelectorAll('._req'); 

            for (let index = 0; index < formReq.length; index++) {
                const input = formReq[index];
                formRemoveError(input);

                if (input.classList.contains('_email')) {
                    if (emailTest(input)) {
                        formAddError(input);
                        error++;
                    }
                } else if (input.classList.contains('_phone')) {
                    if (input.value.length <= 16) {
                        formAddError(input);
                        error++;
                    }
                } else if (input.getAttribute("type") === "checkbox" && !input.checked) {
                    formAddError(input);
                    error++;
                } else {
                    if (input.value === '') {
                        formAddError(input);
                        error++;
                    }
                }
            }
            return error;
        }
        function formAddError(input) {
            input.parentElement.classList.add('_error');
            input.classList.add('_error');
        }
        function formRemoveError(input) {
            input.parentElement.classList.remove('_error');
            input.classList.remove('_error');
        }
        function emailTest(input) {
            return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
        }
    });
    
})