class Loan {
    constructor(id, name, montlyIncome, desiredAmount, desiredTerm) {
        this.id = id;
        this.name = name;
        this.montlyIncome = montlyIncome;
        this.desiredAmount = desiredAmount;
        this.desiredTerm = desiredTerm;
    }
}


class LoanManager {
    constructor() {
        const storedLoans = JSON.parse(localStorage.getItem("allLoans"));
        this.allLoans = storedLoans ? storedLoans : [];
    }
    
    addToAllLoans(loan) {
        this.allLoans.push(loan);
        localStorage.setItem("allLoans", JSON.stringify(this.allLoans));
    }
}

let loanManager = new LoanManager();