class Loan {
    constructor(id, name, monthlyIncome, desiredAmount, desiredTerm) {
        this.id = id;
        this.name = name;
        this.monthlyIncome = monthlyIncome;
        this.desiredAmount = desiredAmount;
        this.desiredTerm = desiredTerm;
        this.offers = []; // added loan offers property
        this.selectedOffer = null; // added selected offer property
        this.totalOwnedAmount = null; // added total owned amount property
        this.createdAt = Date.now(); // added created at property
    }
}


class LoanManager {
    constructor() {
        const storedLoans = JSON.parse(localStorage.getItem("allLoans"));
        this.allLoans = storedLoans ? storedLoans : [];

        const storedRejectedLoans = JSON.parse(localStorage.getItem("rejectedLoans"));
        this.rejectedLoans = storedRejectedLoans ? storedRejectedLoans : [];

        this.lenders = [
            { name: "Lender 1", maxLoanAmount: 50000, maxInterestRate: 7 },
            { name: "Lender 2", maxLoanAmount: 100000, maxInterestRate: 9 },
            { name: "Lender 3", maxLoanAmount: 150000, maxInterestRate: 11 },
        ];
    }

    evaluateLoan(loan) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const annualIncome = loan.monthlyIncome * 12;
                let interestRate = 0;
                if (annualIncome < 20000) {
                    interestRate = 10;
                } else if (annualIncome >= 20000 && annualIncome <= 50000) {
                    interestRate = 8;
                } else if (annualIncome > 50000) {
                    interestRate = 6;
                }

                let isEligible = true;
                if (loan.desiredAmount <= annualIncome * 0.5) {
                    isEligible = true;
                } else if (
                    loan.desiredAmount > annualIncome * 0.5 &&
                    loan.desiredAmount <= annualIncome &&
                    loan.desiredTerm <= 24
                ) {
                    isEligible = true;
                } else {
                    isEligible = false;
                }

                const offers = [];
                this.lenders.forEach((lender) => {
                    if (
                        loan.desiredAmount <= lender.maxLoanAmount &&
                        interestRate <= lender.maxInterestRate
                    ) {
                        const interest = (loan.desiredAmount * interestRate) / 100;
                        const totalAmount = loan.desiredAmount + interest;
                        const monthlyPayment = totalAmount / loan.desiredTerm;

                        offers.push({
                            lender: lender.name,
                            interestRate: interestRate,
                            loanAmount: loan.desiredAmount,
                            monthlyPayment: monthlyPayment,
                            loanTerm: loan.desiredTerm,
                        });
                    }
                });

                const result = {
                    loanId: loan.id,
                    isEligible: isEligible,
                    interestRate: interestRate,
                    offers: offers,
                };

                if (isEligible) {
                    alert("Loan is approved");
                    resolve(result);
                    this.allLoans.push(loan);
                    localStorage.setItem("allLoans", JSON.stringify(this.allLoans));

                } if (this.allLoans.includes(loan)) {
                    let viewOffersButton = document.getElementById("viewOffers");
                    viewOffersButton.style.display = "block";
                    
                } else {
                    reject("Loan is rejected");
                    this.rejectedLoans.push(loan);
                    localStorage.setItem("rejectedLoans", JSON.stringify(this.rejectedLoans));
                    document.getElementById("applicationsOverview").style.display = "none";
                }
            }, 6000);
        })

            .catch((error) => {
                alert(error);
            });
    }

    takeOffer(loan, offer) {
        loan.status = "Taken";
        loan.lender = offer.lenderName;
        loan.interestRate = offer.interestRate;
        loan.loanAmount = offer.loanAmount;
        loan.monthlyPayment = offer.monthlyPayment;
        loan.loanTerm = offer.loanTerm;
        localStorage.setItem("allLoans", JSON.stringify(this.allLoans));
    }
}

let loanManager = new LoanManager();


