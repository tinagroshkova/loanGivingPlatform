class User {
    constructor(user, pass, isAdmin, loans, monthlyIncome) {
        this.username = user;
        this.pass = pass;
        this.isAdmin = isAdmin;
        this.loans = loans;
        this.monthlyIncome = localStorage.getItem(`${user}_monthlyIncome`) || 0;
        this.money = Math.floor(Math.random() * 10001);
        this.money = localStorage.getItem(`${user}_money`) || Math.floor(Math.random() * 10001);
        this.lastUpdated = localStorage.getItem(`${user}_lastUpdated`) || Date.now();


        setInterval(() => {
            this.updateMoney();
        }, 30000);

    }

    updateMoney() {
        const now = Date.now();
        const monthsPassed = Math.floor((now - this.lastUpdated) / 30000); // 30 seconds per month
        this.money = parseInt(this.money) + this.monthlyIncome * monthsPassed;
        this.lastUpdated = parseInt(this.lastUpdated) + monthsPassed * 30000;
        localStorage.setItem(`${this.username}_monthlyIncome`, this.monthlyIncome);
        localStorage.setItem(`${this.username}_money`, this.money);
        localStorage.setItem(`${this.username}_lastUpdated`, this.lastUpdated.toString());
    }

    addLoan(loan) {
        this.loans.push(loan);
        this.monthlyIncome = parseInt(loan.monthlyIncome);
        localStorage.setItem(this.username, JSON.stringify(this.loans));
    }
    repayLoan(id) {
        const index = this.loans.findIndex(loan => loan.id === id);
        if (index === -1) {
            return false; 
        }
        const [removedLoan] = this.loans.splice(index, 1);
        localStorage.setItem(this.username, JSON.stringify(this.loans));

        // update allLoans array to show that loan has been repaid
        const allLoans = JSON.parse(localStorage.getItem("allLoans")) || [];
        const updatedAllLoans = allLoans.map(loan => {
            if (loan.id === id) {
                return { ...loan, isRepaid: true };
            }
            return loan;
        });
        localStorage.setItem("allLoans", JSON.stringify(updatedAllLoans));

        return removedLoan;
    }

}

class Admin extends User {
    constructor(name, password) {
        super(name, password, true);
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
                    this.loadLoans(loggedUser.username),
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
                        this.loadLoans(user.username),
                        0
                    );
                }
            });
        } else {
            this.users = [
                new User("slavi", "bahur", false, [], 0),
                new User("bahur", "slavi", false, [], 0),
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

        let newUser = new User(username, pass, false, []);
        this.users.push(newUser);
        this.loggedUser = newUser;
        localStorage.setItem("isThereUser", JSON.stringify(this.loggedUser));
        localStorage.setItem("allUsers", JSON.stringify(this.users));
        return true;
    };

    loadLoans = (username) => {
        let loans = JSON.parse(localStorage.getItem(username)) || [];
        return loans.map(loan => new Loan(
            loan.id,
            loan.name,
            Number(loan.montlyIncome),
            Number(loan.desiredAmount),
            loan.desiredTerm,
            loan.selectedOffer,
            Number(loan.totalAmount)
        ));
    };

    logout = () => {
        this.loggedUser = null;
        localStorage.removeItem("isThereUser");
    };

}

let userManager = new UserManager();