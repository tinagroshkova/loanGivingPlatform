class ViewController {

    constructor() {
        window.addEventListener("load", this.handleHashChange);
        window.addEventListener("hashchange", this.handleHashChange);
        this.usedIDs = [];
    }

    handleHashChange = () => {
        const pageIds = ["login", "register", "home", "applicationsOverview"];

        let hash = location.hash.slice(1) || pageIds[0];

        if (hash === "home") {
            let loggedUser = document.getElementById("loggedUserName");
            let logOut = document.getElementById("logOut");

            if (userManager.loggedUser) {
                loggedUser.innerText = `User: ${userManager.loggedUser.username}`;
                logOut.innerText = "|  Logout";
                this.renderLogout();
            } else {
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

    renderLogout = () => {
        let logOut = document.getElementById("logOut");
        logOut.addEventListener("click", () => {
            userManager.logout();
            let loggedUser = document.getElementById("loggedUserName");
            loggedUser.innerText = "";
            logOut.innerText = "";
            location.hash = "login";
        });
    };

    
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

        // document.getElementById('username').addEventListener('input', () => {
        //     this.validateRegister();
        // });

        // document.getElementById('pass').addEventListener('input', () => {
        //     this.validateRegister();
        // });

        // document.getElementById('confirm-pass').addEventListener('input', () => {
        //     this.validateRegister();
        // });

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


    generateID = () => {
        let id = "";
        while (id.length < 6) {
            id += Math.floor(Math.random() * 10);
        }
        if (this.usedIDs.includes(id)) {
            return this.generateID(); 
        } else {
            this.usedIDs.push(id);
            return id;
        }
    }

    handleLoanSubmission = (event) => {
        event.preventDefault();
        let id = this.generateID();

        //set all buttons depending the loan status

        let lendersOffers = document.getElementById("lendersOffers");

        let allOffers = document.getElementById("allOffers");
        allOffers.style.display = "none";

        let viewOffersBtn = document.getElementById("viewOffers");
        viewOffersBtn.style.display = "none";

        let chooseOffer = document.getElementById("chooseOffer");
        chooseOffer.style.display = "none";


        let applicationsOverview = document.getElementById("applicationsOverview");

        if (userManager.loggedUser && userManager.loggedUser.isAdmin === false) {

            let borrowerName = userManager.loggedUser.username;
            let cancelBtn = document.getElementById("cancelBtn");

            let borrowerIncome = document.getElementById("borrowerIncome");
            let requestedAmount = document.getElementById("requestedAmount");
            let requestedTerm = document.getElementById("requestedTerm");

            let loan = new Loan(id, borrowerName, borrowerIncome.value, requestedAmount.value, requestedTerm.value);
            let isLoanCanceled = false;

            let addLoanTimeout = setTimeout(() => {

                if (!isLoanCanceled) {
                    alert("Your credit request will be reviewed by an officer shortly");
                    userManager.loggedUser.addLoan(loan);
                    loanManager.addToAllLoans(loan);
                    viewOffersBtn.style.display = "block";
                }
            }, 6000);

            viewOffersBtn.addEventListener("click", () => {
                console.log('view button is clicked');
                allOffers.style.display = "block";
                lendersOffers.style.display = "block"
                viewOffersBtn.style.display = "none";
                chooseOffer.style.display = "block";
            });

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
            location.hash = "applicationsOverview";

        } if (userManager.loggedUser.isAdmin === true) {
            alert("Don't you dare to request for loan!");
        }

        borrowerIncome.value = borrowerIncome.defaultValue;
        requestedAmount.value = requestedAmount.defaultValue;
        requestedTerm.value = requestedTerm.defaultValue;
    }
}

let viewController = new ViewController();


