class User {
    constructor(user, pass, isAdmin, loans) {
        this.username = user;
        this.pass = pass;
        this.isAdmin = isAdmin;
        this.loans = loans;
    }

    addLoan(loan) {
        if (this.isAdmin === false) {
            this.loans.push(loan);
            localStorage.setItem(this.username, JSON.stringify(this.loans));
        } else {
            alert("You can't request for loan, fking admin!")
        }
    }
}

class Admin extends User {
    constructor(name, password) {
        super(name, password, true);
        this.pendingLoans = [];
        this.approvedLoans = [];
        this.rejectedLoans = [];
    }

    approveLoan(loan) {
        if (this.pendingLoans.includes(loan)) {
            this.pendingLoans.splice(this.pendingLoans.indexOf(loan), 1);
            this.approvedLoans.push(loan);
            console.log(`Loan with ID ${loan.id} has been approved.`);
        } else {
            console.log(`Loan with ID ${loan.id} is not pending.`);
        }
    }

    rejectLoan(loan) {
        if (this.pendingLoans.includes(loan)) {
            this.pendingLoans.splice(this.pendingLoans.indexOf(loan), 1);
            this.rejectedLoans.push(loan);
            console.log(`Loan with ID ${loan.id} has been rejected.`);
        } else {
            console.log(`Loan with ID ${loan.id} is not pending.`);
        }
    }
}

class UserManager {
    constructor() {
        this.users = [];

        let loggedUser = JSON.parse(localStorage.getItem("isThereUser"));
        if (loggedUser) {
            if (loggedUser.isAdmin) {
                this.loggedUser = new Admin(
                    loggedUser.username,
                    loggedUser.pass
                );
            } else {
                this.loggedUser = new User(
                    loggedUser.username,
                    loggedUser.pass,
                    false,
                    this.loadLoans(loggedUser.username)
                );
            }
        }

        let allUsers = JSON.parse(localStorage.getItem("allUsers"));

        if (allUsers) {
            this.users = allUsers.map((user) => {
                if (user.isAdmin) {
                    return new Admin(user.username, user.pass, true);
                } else {
                    return new User(
                        user.username,
                        user.pass,
                        false,
                        this.loadLoans(user.username)
                    );
                }
            });
        } else {
            this.users = [
                new User("slavi", "bahur", false, []),
                new User("bahur", "slavi", false, []),
                new Admin("tina", "12345", true),
            ];
            localStorage.setItem("allUsers", JSON.stringify(this.users));
        }
    }

    loggedUser = null;

    login = ({ username, pass }) => {
        let foundUser = this.users.find(
            (user) => user.username === username && user.pass === pass
        );

        if (foundUser) {
            this.loggedUser = foundUser;
            localStorage.setItem("isThereUser", JSON.stringify(this.loggedUser));
            return true;
        }

        return false;
    };

    register = ({ username, pass }) => {
        let foundUser = this.users.find((user) => user.username === username);

        if (foundUser) {
            return false;
        }

        this.users.push(new User(username, pass, false, []));
        localStorage.setItem("allUsers", JSON.stringify(this.users));
        return true;
    };

    loadLoans = (username) => {
        let loans = JSON.parse(localStorage.getItem(username)) || [];
        return loans.map(loan =>
            new Loan(
                loan.id,
                loan.name,
                loan.montlyIncome,
                loan.desiredAmount,
                loan.desiredTerm
            )
        );
    };

    logout = () => {
        this.loggedUser = null;
        localStorage.removeItem("isThereUser");
    };

    getPendingLoans = () => {
        if (this.loggedUser instanceof Admin) {
            return this.loggedUser.pendingLoans;
        } else {
            return [];
        }
    };

    approveLoan = (loan) => {
        if (this.loggedUser instanceof Admin) {
            this.loggedUser.approveLoan(loan);
        }
    };

    rejectLoan = (loan) => {
        if (this.loggedUser instanceof Admin) {
            this.loggedUser.rejectLoan(loan);
        }
    };
}

let userManager = new UserManager();


