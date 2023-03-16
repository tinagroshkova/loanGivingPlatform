class User {
    constructor(user, pass, loans) {
        this.username = user;
        this.pass = pass;
        this.loans = loans;
    }

    addLoan(loan) {
        this.loans.push(loan);
        localStorage.setItem(this.username, JSON.stringify(this.loans));
    }
}

class Admin extends User {
    constructor(name, password) {
        super(name, password);
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
        let loggedUser = JSON.parse(localStorage.getItem('isThereUser'));

        if (loggedUser) {
            if (loggedUser.isAdmin) {
                this.loggedUser = new Admin(loggedUser.username, loggedUser.pass);
            } else {
                this.loggedUser = new User(loggedUser.username, loggedUser.pass, this.loadLoans(loggedUser.username));
            }
        }

        let allUsers = JSON.parse(localStorage.getItem('allUsers'));
        if (allUsers) {
            this.users = allUsers.map(user => {
                if (user.isAdmin) {
                    return new Admin(user.username, user.pass);
                } else {
                    return new User(user.username, user.pass, this.loadLoans(user.username));
                }
            });
        } else {
            this.users = [
                // new User('slavi', 'bahur', []),
                // new User('bahur', 'slavi', []),
                // new Admin('tina', 'T12345*')
            ];
            localStorage.setItem('allUsers', JSON.stringify(this.users));
        }
    }

    // loggedUser = null;

    login = ({ username, pass }) => {
        let foundUser = this.users.find(user => user.username === username && user.pass === pass);

        if (foundUser) {
            this.loggedUser = foundUser;
            localStorage.setItem(
                'isThereUser',
                JSON.stringify({
                    username: foundUser.username,
                    pass: foundUser.pass,
                    isAdmin: foundUser instanceof Admin,
                })
            );
            return true;
        } else {
            return false;
        }
    }

    logout() {
        localStorage.removeItem("isThereUser");
        this.loggedUser = undefined;
    }

    register = ({ username, pass }) => {
        let foundUser = this.users.find(user => user.username === username);
        
        if (foundUser) {
            return false;
        }

        this.users.push(new User(username, pass, []));
        localStorage.setItem('allUsers', JSON.stringify(this.users));
        return true;
    }

    loadLoans = (username) => {
        let loans = JSON.parse(localStorage.getItem(username)) || [];
        return loans.map(loan => new Loan(loan.name, loan.montlyIncome, loan.desiredAmount, loan.desiredTerm));
    }
}

let userManager = new UserManager();

// class User {
//     constructor(user, pass, loans) {
//         this.username = user;
//         this.pass = pass;
//         this.loans = loans;
//     }

//     addLoan(loan) {
//         this.loans.push(loan);
//         localStorage.setItem(this.username, JSON.stringify(this.loans));
//     }
// }

// class Admin extends User {
//     constructor(name, password) {
//         super(name, password);
//         this.pendingLoans = [];
//         this.approvedLoans = [];
//         this.rejectedLoans = [];
//     }

//     approveLoan(loan) {
//         if (this.pendingLoans.includes(loan)) {
//             this.pendingLoans.splice(this.pendingLoans.indexOf(loan), 1);
//             this.approvedLoans.push(loan);
//             console.log(`Loan with ID ${loan.id} has been approved.`);
//         } else {
//             console.log(`Loan with ID ${loan.id} is not pending.`);
//         }
//     }

//     rejectLoan(loan) {
//         if (this.pendingLoans.includes(loan)) {
//             this.pendingLoans.splice(this.pendingLoans.indexOf(loan), 1);
//             this.rejectedLoans.push(loan);
//             console.log(`Loan with ID ${loan.id} has been rejected.`);
//         } else {
//             console.log(`Loan with ID ${loan.id} is not pending.`);
//         }
//     }
// }



// class UserManager {
//     constructor() {
//         let loggedUser = JSON.parse(localStorage.getItem('isThereUser'));
//         // let isAdmin = false;

//         if (loggedUser) {
//             if (loggedUser.isAdmin) {
//                 this.loggedUser = new Admin(loggedUser.username, loggedUser.pass);
//             } else {
//                 this.loggedUser = new User(loggedUser.username, loggedUser.pass, this.loadLoans(loggedUser.username));
//             }
//         }
//         let allUsers = JSON.parse(localStorage.getItem('allUsers'));
//         if (allUsers) {
//             this.users = allUsers.map(user => {
//                 if (user.isAdmin) {
//                     return new Admin(user.username, user.pass);
//                 } else {
//                     return new User(user.username, user.pass, this.loadLoans(user.username));
//                 }
//             });

//         } else {
//             this.users = [
//                 new User('slavi', 'bahur', []),
//                 new User('bahur', 'slavi', []),
//                 new Admin('tina', 'T12345*')
//             ];
//             localStorage.setItem('allUsers', JSON.stringify(this.users));
//         }
//     }

//     loggedUser = null;

//     login = ({ username, pass }) => {
//         let foundUser = this.users.find(user => user.username === username && user.pass === pass);

//         if (foundUser) {
//             this.loggedUser = foundUser;
//             localStorage.setItem('isThereUser', JSON.stringify(this.loggedUser));
//             return true;
//         }

//         return false;
//     }

//     register = ({ username, pass }) => {
//         let foundUser = this.users.find(user => user.username === username);

//         if (foundUser) {
//             return false;
//         }

//         this.users.push(new User(username, pass, []));
//         localStorage.setItem('allUsers', JSON.stringify(this.users));
//         return true;
//     }

//     loadLoans = (username) => {
//         let loans = JSON.parse(localStorage.getItem(username)) || [];
//         return loans.map(loan => new Loan(loan.name, loan.montlyIncome, loan.desiredAmount, loan.desiredTerm));
//     }
// }

// let userManager = new UserManager();


