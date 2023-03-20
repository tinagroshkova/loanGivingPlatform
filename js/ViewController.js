class ViewController {

    constructor() {
        window.addEventListener("load", this.handleHashChange);
        window.addEventListener("hashchange", this.handleHashChange);
        this.usedIDs = [];
    }

    handleHashChange = () => {
        const pageIds = ["login", "register", "home", "applicationsOverview", "loansOverviewPage", "statistics"];

        let hash = location.hash.slice(1) || "login";

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

        pageIds.forEach((pageId) => {
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
            case "loansOverviewPage":
                this.renderUserLoans();
                break;
        }
    };

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
                    if (userManager.loggedUser.isAdmin) {
                        location.hash = "statistics";
                        document.getElementById("statisticsPage").style.display = "block";
                        this.renderLoansTableBody();
                    } else {
                        this.renderUserLoans();
                        document.getElementById("loansOverviewPage").style.display = "block";
                        location.hash = "home";
                    }
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

        let logUserOut = () => {
            if (window.confirm("Do you really want to leave?")) {
                userManager.logout();
                let loggedUser = document.getElementById("loggedUserName");
                loggedUser.innerText = "";
                logOut.innerText = "";
                location.hash = "login";
                logOut.removeEventListener("click", logUserOut);
            }
        };

        logOut.addEventListener("click", logUserOut);
        // document.getElementById("statisticsPage").style.display = "none";
        // document.getElementById("loansOverviewPage").style.display = "none";
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
                    let newUser = userManager.loggedUser;
                    location.hash = "home";
                    alert(`Great ${newUser.username}! You are registered now`);
                } else {
                    registerError.innerText = 'Username already taken';
                    registerError.style.display = 'block';
                }
            }
            registerForm.reset();
        });
    };


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

        let applicationsOverview = document.getElementById("applicationsOverview");

        let lendersOffers = document.getElementById("lendersOffers");

        let allOffers = document.getElementById("allOffers");
        allOffers.style.display = "none";

        let viewOffersBtn = document.getElementById("viewOffers");
        viewOffersBtn.style.display = "none";

        let borrowerName = userManager.loggedUser.username;
        let cancelBtn = document.getElementById("cancelBtn");

        let borrowerIncome = document.getElementById("borrowerIncome");
        let requestedAmount = document.getElementById("requestedAmount");
        let requestedTerm = document.getElementById("requestedTerm");

        if (userManager.loggedUser.isAdmin === false) {
            let loan = new Loan(id, borrowerName, borrowerIncome.value, requestedAmount.value, requestedTerm.value);
            let isLoanCanceled = false;

            let addLoanTimeout = setTimeout(() => {
                if (!isLoanCanceled) {
                    alert("Your credit request will be reviewed by an officer shortly");
                    loanManager.evaluateLoan(loan);
                    cancelBtn.style.display = "none";
                }
            }, 2000); // da go promenq predi da ka4a

            viewOffersBtn.addEventListener("click", () => {
                allOffers.style.display = "block";
                lendersOffers.style.display = "block"
                viewOffersBtn.style.display = "none";
            });

            cancelBtn.addEventListener('click', () => {
                isLoanCanceled = true;
                clearTimeout(addLoanTimeout);
                alert("Your loan request is canceled!")
                cancelBtn.style.display = "none";
                applicationsOverview.style.display = "none";

            });

            let loanId = document.getElementById("loanId");
            loanId.innerText = id;

            let loanAmount = document.getElementById("loanAmount");
            loanAmount.innerText = "$" + requestedAmount.value;

            let loanTerm = document.getElementById("loanTerm");
            loanTerm.innerText = requestedTerm.value + " months";

            let status = document.getElementById("loanStatus");
            status.innerText = "Pending";

            alert("Loan submitted successfully!");
            location.hash = "applicationsOverview";

        } else {
            alert("Don't you dare to request for loan!");
        }

        borrowerIncome.value = borrowerIncome.defaultValue;
        requestedAmount.value = requestedAmount.defaultValue;
        requestedTerm.value = requestedTerm.defaultValue;
    }

    renderLoansTableBody = () => {
        const loansStatistics = loanManager.getAllLoans();
        localStorage.setItem("loansStatistics", JSON.stringify(loansStatistics));
        console.log(loansStatistics);
        let tableBody = document.getElementById("loansTableBody");
        let lendersOffersCount = loanManager.sortLendersByOffer(); //to fix this
        console.log(lendersOffersCount);
        let totalCount = loansStatistics.acceptedLoans.length + loansStatistics.rejectedLoans.length;
        if (loansStatistics) {

            tableBody.innerHTML = `
            <tbody>
            <tr><td>Number of loan applications that were eligible</td><td>${loansStatistics.acceptedLoans.length}</td></tr>
            <tr><td>Number of loan applications that were rejected</td><td>${loansStatistics.rejectedLoans.length}</td></tr>
            <tr><td>Number of loan applications for each lender</td><td>${lendersOffersCount}</td></tr>
            <tr><td>Total loan amount requested</td><td>$${loanManager.getTotalLoansAmount() + loanManager.getRejectedLoansAmount()}</td></tr>
            <tr><td>Total loan amount approved</td><td>$${loanManager.getTotalLoansAmount()}</td></tr>
            <tr><td>Total monthly payment for all loans</td><td>$${loanManager.getTotalMontlyPayment()}</td></tr>
            <tr><td>Total number of loan applications</td><td>${totalCount}</td></tr>
            </tbody>
            `;
        } else {
            alert("No loans found!");
        }
    };
    renderUserLoans = () => {
        if (userManager.loggedUser.isAdmin === false) {
            let userLoans = userManager.loggedUser.loans;
            if (userLoans.length) {
                let table = document.getElementById("userLoans");
                table.innerHTML = "";

                let tableHeader = document.createElement("tr");
                tableHeader.innerHTML = `<tr> 
                <th>Loan ID</th> 
                <th>Interest rate</th> 
                <th>Total loan amount</th> 
                <th>Monthly payment</th> 
                <th>Requested term</th> 
                <th>Status</th>`;
                table.append(tableHeader);

                userLoans.forEach(loan => {
                    let tr = document.createElement("tr");
                    tr.innerHTML = "";
                    tr.innerHTML = `
                        <td>${loan.id}</td>
                        <td>${loan.selectedOffer.interestRate}%</td> 
                        <td>$${loan.selectedOffer.totalAmount}</td> 
                        <td>$${loan.selectedOffer.monthlyPayment.toFixed(2)}</td> 
                        <td>${loan.desiredTerm} months</td> 
                        <td>Accepted</td>
                    `;
                    table.append(tr);


                    let repayBtn = document.createElement("button");
                    repayBtn.innerText = "Repay in full";
                    repayBtn.classList.add("repayBtn");

                    repayBtn.addEventListener("click", () => {
                        if (userManager.loggedUser.money >= loan.selectedOffer.totalAmount){
                            console.log(userManager.loggedUser.money)
                            userManager.loggedUser.repayLoan(loan.id);
                            loanManager.repayLoan(loan.id);
                            alert("Great! You repaid your loan");
                            userManager.loggedUser.money -= loan.selectedOffer.totalAmount;
                            console.log(userManager.loggedUser.money)
                            table.removeChild(tr);

                        } else {
                            alert("You have not enough money")
                        }
    
                    })
                    tr.append(repayBtn);
                })
            }
        }
    }
}

let viewController = new ViewController();

