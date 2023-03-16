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


class UserManager {

    constructor() {
        let loggedUser = JSON.parse(localStorage.getItem('isThereUser'));
        if (loggedUser) {
            this.loggedUser = new User(loggedUser.username, loggedUser.pass, this.loadLoans(loggedUser.username));
        }
        let allUsers = JSON.parse(localStorage.getItem('allUsers'));
        if (allUsers) {
            this.users = allUsers.map(user => new User(user.username, user.pass, this.loadLoans(user.username)));
        } else {
            this.users = [
                new User('slavi', 'bahur', []),
                new User('bahur', 'slavi', []),
                new User('tina', 'T12345*', [])
            ];
            localStorage.setItem('allUsers', JSON.stringify(this.users));
        }
    }

    loggedUser = null;

    login = ({ username, pass }) => {
        let foundUser = this.users.find(user => user.username === username && user.pass === pass);

        if (foundUser) {
            this.loggedUser = foundUser;
            localStorage.setItem('isThereUser', JSON.stringify(this.loggedUser));
            return true;
        }

        return false;
    }

    register = ({ username, pass }) => {
        let foundUser = this.users.find(user => user.username === username);

        if (foundUser) {
            // username is already taken
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


// class UserManager {

//     constructor() {
//         let loggedUser = JSON.parse(localStorage.getItem('isThereUser'));
//         if (loggedUser) {
//             this.loggedUser = new User(loggedUser.username, loggedUser.pass, this.loadLoans(loggedUser.username));
//         }
//         let allUsers = JSON.parse(localStorage.getItem('allUsers'));
//         if (allUsers) {
//             this.users = allUsers.map(user => new User(user.username, user.pass, this.loadLoans(user.username)));
//         } else {
//             this.users = [
//                 new User('slavi', 'bahur', []),
//                 new User('bahur', 'slavi', []),
//                 new User('tina', 'T12345*', [])
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
//             // username is already taken
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