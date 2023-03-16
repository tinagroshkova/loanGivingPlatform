class ViewController {

    constructor() {
        window.addEventListener("load", this.handleHashChange);
        window.addEventListener("hashchange", this.handleHashChange);
        this.id = 1;
    }



    handleHashChange = () => {
        const pageIds = ["login", "register", "home", "applicationsOverview"];

        let hash = location.hash.slice(1) || pageIds[0];

        if (hash === "home") {
            if (!userManager.loggedUser) {
                location.hash = "login";
                return;
            }
            document.getElementById("loanForm").addEventListener("submit", this.handleLoanSubmission);
            document.getElementById("borrowerName").value = userManager.loggedUser.username;
        }

        pageIds.forEach(pageId => {
            let element = document.getElementById(pageId);
            if (pageId === hash) {
                element.style.display = "flex";
            } else {
                element.style.display = "none";
            }
        });

        switch (hash) {
            case "login":
                this.renderLogin();
                break;

            case "register":
                this.validateRegister();
                this.renderRegister();
                break;
        }
    }

    renderLogin = () => {
        let form = document.getElementById('loginForm');
        let usernameInput = document.getElementById('usernameInput');
        let passwordInput = document.getElementById('passwordInput');
        let errorMessage = document.getElementById('loginError');
        let loginButton = document.getElementById('loginButton');

        usernameInput.addEventListener('input', () => {
            loginButton.disabled = !(usernameInput.value && passwordInput.value);
        });

        passwordInput.addEventListener('input', () => {
            loginButton.disabled = !(usernameInput.value && passwordInput.value);
        });

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            let username = e.target.elements.username.value;
            let pass = e.target.elements.pass.value;

            if (this.validateLogin({ username, pass })) {
                let successfulLogin = userManager.login({ username, pass });

                if (!successfulLogin) {
                    errorMessage.innerText = "Wrong username or password!";
                    errorMessage.style.display = "block";

                } else {
                    alert("Great! You are logged in now!");
                    location.hash = "home";
                    errorMessage.innerText = "";
                    console.log(userManager.loggedUser);

                    form.reset();
                }
            }
        });
        loginButton.disabled = !(usernameInput.value && passwordInput.value);
    }


    validateLogin = ({ username, pass }) => {
        if (!username || !pass) {
            return false;
        }
        return true;
    }

    validateRegister = () => {
        let registerError = document.getElementById('registerError');
        let username = document.getElementById('username').value;
        let pass = document.getElementById('pass').value;
        let confirmPass = document.getElementById('confirm-pass').value;
        let registerButton = document.getElementById('registerButton');

        let passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/;

        if (username && pass && confirmPass) {

            if (pass === confirmPass) {
                if (passRegex.test(pass)) {
                    registerButton.disabled = false;
                    registerError.innerText = "";
                    return true;

                } else {
                    registerError.innerText = 'Password must be at least 6 characters long and contain at least one special character, one lowercase letter, and one uppercase letter.';
                }

            } else {
                registerError.innerText = 'Password and confirm password do not match.';
            }
        }

        registerError.style.display = 'block';
        registerButton.disabled = true;
        return false;
    }

    renderRegister = () => {
        let registerForm = document.getElementById("registerForm");
        let registerButton = document.getElementById('registerButton');
        let registerError = document.getElementById('registerError');

        registerButton.disabled = true;

        document.getElementById('username').addEventListener('input', () => {
            this.validateRegister();
        });

        document.getElementById('pass').addEventListener('input', () => {
            this.validateRegister();
        });

        document.getElementById('confirm-pass').addEventListener('input', () => {
            this.validateRegister();
        });

        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();

            if (this.validateRegister()) {
                let username = document.getElementById('username').value;
                let pass = document.getElementById('pass').value;
                let registrationSuccessful = userManager.register({ username, pass });

                if (registrationSuccessful) {
                    userManager.loggedUser = { username, pass };
                    location.hash = "home";
                } else {
                    registerError.innerText = 'Username already taken';
                    registerError.style.display = 'block';
                }
            }
            registerForm.reset();
        });
    }

    handleLoanSubmission = (event) => {
        let id = 1;
        event.preventDefault();
        let borrowerName = userManager.loggedUser.username;
        let cancelBtn = document.getElementById("cancelBtn");

        let borrowerIncome = document.getElementById("borrowerIncome");
        let requestedAmount = document.getElementById("requestedAmount");
        let requestedTerm = document.getElementById("requestedTerm");

        let loan = new Loan(borrowerName, borrowerIncome.value, requestedAmount.value, requestedTerm.value);

        let addLoanTimeout = setTimeout(() => {
            if (!isLoanCanceled) {
                userManager.loggedUser.addLoan(loan);
                applicationsOverview.style.display = "none";
                alert("Your credit request will be reviewed by an officer shortly");
            }
        }, 6000);

        let isLoanCanceled = false;
        cancelBtn.addEventListener('click', () => {
            isLoanCanceled = true;
            clearTimeout(addLoanTimeout);
            applicationsOverview.style.display = "none";
        });

        let loanId = document.getElementById("loanId");
        loanId.innerText = id;

        let loanAmount = document.getElementById("loanAmount");
        loanAmount.innerText = requestedAmount.value;

        let loanTerm = document.getElementById("loanTerm");
        loanTerm.innerText = requestedTerm.value;

        let status = document.getElementById("loanStatus");
        status.innerText = "Pending";

        alert("Loan submitted successfully!");

        borrowerIncome.value = borrowerIncome.defaultValue;
        requestedAmount.value = requestedAmount.defaultValue;
        requestedTerm.value = requestedTerm.defaultValue;

        location.hash = "applicationsOverview";
    }
}
let viewController = new ViewController();


// class ViewController {

//     constructor() {
//         window.addEventListener("load", this.handleHashChange);
//         window.addEventListener("hashchange", this.handleHashChange);
//     }


//     handleHashChange = () => {
//         const pageIds = ["login", "register", "home"];

//         let hash = location.hash.slice(1) || pageIds[0];

//         if (hash === "home") {
//             if (!userManager.loggedUser) {
//                 location.hash = "login";
//                 return;
//             }
//             document.getElementById("loanForm").addEventListener("submit", this.handleLoanSubmission);
//             document.getElementById("borrowerName").value = userManager.loggedUser.username;
//         }

//         pageIds.forEach(pageId => {
//             let element = document.getElementById(pageId);
//             if (pageId === hash) {
//                 element.style.display = "flex";
//             } else {
//                 element.style.display = "none";
//             }
//         });

//         switch (hash) {
//             case "login":
//                 this.renderLogin();
//                 break;

//             case "register":
//                 this.validateRegister();
//                 this.renderRegister();
//                 break;
//         }
//     }

//     renderLogin = () => {
//         let form = document.getElementById('loginForm');
//         let usernameInput = document.getElementById('usernameInput');
//         let passwordInput = document.getElementById('passwordInput');
//         let errorMessage = document.getElementById('loginError');
//         let loginButton = document.getElementById('loginButton');

//         usernameInput.addEventListener('input', () => {
//             loginButton.disabled = !(usernameInput.value && passwordInput.value);
//         });

//         passwordInput.addEventListener('input', () => {
//             loginButton.disabled = !(usernameInput.value && passwordInput.value);
//         });

//         form.addEventListener("submit", (e) => {
//             e.preventDefault();
//             let username = e.target.elements.username.value;
//             let pass = e.target.elements.pass.value;

//             if (this.validateLogin({ username, pass })) {
//                 let successfulLogin = userManager.login({ username, pass });

//                 if (!successfulLogin) {
//                     errorMessage.innerText = "Wrong username or password!";
//                     errorMessage.style.display = "block";

//                 } else {
//                     alert("Great! You are logged in now!");
//                     location.hash = "home";
//                     errorMessage.innerText = "";
//                     console.log(userManager.loggedUser);

//                     form.reset();
//                 }
//             }
//         });
//         loginButton.disabled = !(usernameInput.value && passwordInput.value);
//     }


//     validateLogin = ({ username, pass }) => {
//         if (!username || !pass) {
//             return false;
//         }
//         return true;
//     }

//     validateRegister = () => {
//         let registerError = document.getElementById('registerError');
//         let username = document.getElementById('username').value;
//         let pass = document.getElementById('pass').value;
//         let confirmPass = document.getElementById('confirm-pass').value;
//         let registerButton = document.getElementById('registerButton');

//         let passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/;

//         if (username && pass && confirmPass) {

//             if (pass === confirmPass) {
//                 if (passRegex.test(pass)) {
//                     registerButton.disabled = false;
//                     registerError.innerText = "";
//                     return true;

//                 } else {
//                     registerError.innerText = 'Password must be at least 6 characters long and contain at least one special character, one lowercase letter, and one uppercase letter.';
//                 }

//             } else {
//                 registerError.innerText = 'Password and confirm password do not match.';
//             }
//         }

//         registerError.style.display = 'block';
//         registerButton.disabled = true;
//         return false;
//     }

//     renderRegister = () => {
//         let registerForm = document.getElementById("registerForm");
//         let registerButton = document.getElementById('registerButton');
//         let registerError = document.getElementById('registerError');

//         registerButton.disabled = true;

//         document.getElementById('username').addEventListener('input', () => {
//             this.validateRegister();
//         });

//         document.getElementById('pass').addEventListener('input', () => {
//             this.validateRegister();
//         });

//         document.getElementById('confirm-pass').addEventListener('input', () => {
//             this.validateRegister();
//         });

//         registerForm.addEventListener("submit", (e) => {
//             e.preventDefault();

//             if (this.validateRegister()) {
//                 let username = document.getElementById('username').value;
//                 let pass = document.getElementById('pass').value;
//                 let registrationSuccessful = userManager.register({ username, pass });

//                 if (registrationSuccessful) {
//                     userManager.loggedUser = { username, pass };
//                     location.hash = "home";
//                 } else {
//                     registerError.innerText = 'Username already taken';
//                     registerError.style.display = 'block';
//                 }
//             }
//             registerForm.reset();
//         });
//     }

//     handleLoanSubmission = (event) => {
//         event.preventDefault();
//         let borrowerNameInput = document.getElementById("borrowerName");
//         let borrowerName = userManager.loggedUser.username;

//         let borrowerIncome = document.getElementById("borrowerIncome");
//         let requestedAmount = document.getElementById("requestedAmount");
//         const requestedTerm = document.getElementById("requestedTerm");

//         let loan = new Loan(borrowerName, borrowerIncome.value, requestedAmount.value, requestedTerm.value);
//         userManager.loggedUser.addLoan(loan);

//         borrowerIncome.value = borrowerIncome.defaultValue;
//         requestedAmount.value = requestedAmount.defaultValue;
//         requestedTerm.value = requestedTerm.defaultValue;

//         alert("Loan submitted successfully!");
//         borrowerNameInput.focus();
//     };
// }
// let viewController = new ViewController();



