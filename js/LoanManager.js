
class Loan {
    constructor(id, name, monthlyIncome, desiredAmount, desiredTerm, selectedOffer, totalAmount) {
        this.id = id;
        this.name = name;
        this.monthlyIncome = monthlyIncome;
        this.desiredAmount = desiredAmount;
        this.desiredTerm = desiredTerm;
        this.selectedOffer = selectedOffer;
        this.totalAmount = totalAmount;
    }
}


class LoanManager {
    constructor() {
        const storedLoans = JSON.parse(localStorage.getItem("allLoans"));
        this.allLoans = storedLoans ? storedLoans : [];

        const storedRejectedLoans = JSON.parse(localStorage.getItem("rejectedLoans"));
        this.rejectedLoans = storedRejectedLoans ? storedRejectedLoans : [];

        const storedRepaidLoans = JSON.parse(localStorage.getItem("repaidLoans"));
        this.repaidLoans = storedRepaidLoans ? storedRepaidLoans : [];

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

                if (isEligible) {
                    this.lenders.forEach((lender) => {
                        if (
                            loan.desiredAmount <= lender.maxLoanAmount &&
                            interestRate <= lender.maxInterestRate
                        ) {
                            const interest = Number(loan.desiredAmount * interestRate) / 100;
                            const totalAmount = Number(loan.desiredAmount) + Number(interest);
                            const monthlyPayment = Number(totalAmount / loan.desiredTerm);

                            offers.push({
                                lender: lender.name,
                                interestRate: interestRate,
                                loanAmount: loan.desiredAmount,
                                monthlyPayment: monthlyPayment,
                                loanTerm: loan.desiredTerm,
                                totalAmount: totalAmount,
                            });
                            console.log(offers);
                        }
                    });

                    const offersTable = document.getElementById("lendersOffers");
                    offersTable.innerHTML = "";

                    const headerRow = document.createElement("tr");
                    const th0 = document.createElement("th");
                    th0.innerText = "Lender name";

                    const th1 = document.createElement("th");
                    th1.innerText = "Interest Rate";

                    const th2 = document.createElement("th");
                    th2.innerText = "Loan Amount";

                    const th3 = document.createElement("th");
                    th3.innerText = "Monthly Payment";

                    const th4 = document.createElement("th");
                    th4.innerText = "Loan Term";

                    headerRow.append(th0, th1, th2, th3, th4);
                    offersTable.append(headerRow);

                    offers.forEach((offer) => {

                        const row = document.createElement("tr");

                        const lenderCell = document.createElement("td");
                        lenderCell.textContent = offer.lender;
                        row.appendChild(lenderCell);

                        const interestRateCell = document.createElement("td");
                        interestRateCell.textContent = offer.interestRate + "%";
                        row.appendChild(interestRateCell);

                        const loanAmountCell = document.createElement("td");
                        loanAmountCell.textContent = "$" + offer.loanAmount.toLocaleString();
                        row.appendChild(loanAmountCell);

                        const monthlyPaymentCell = document.createElement("td");
                        monthlyPaymentCell.textContent = "$" + offer.monthlyPayment.toLocaleString();
                        row.appendChild(monthlyPaymentCell);

                        const loanTermCell = document.createElement("td");
                        loanTermCell.textContent = offer.loanTerm + " months";
                        row.appendChild(loanTermCell);

                        const chooseBtn = document.createElement("button");
                        chooseBtn.innerText = "Choose offer";
                        chooseBtn.classList.add("chooseBtn");

                        row.append(chooseBtn);

                        chooseBtn.addEventListener("click", () => {
                            this.takeOffer(loan, offer);
                            alert("You selected offer");
                            document.getElementById("loanStatus").innerText = "Accepted";
                            userManager.loggedUser.addLoan(loan);
                            console.log(userManager.loggedUser.loans);

                            const allRows = offersTable.querySelectorAll("tr");
                            chooseBtn.style.display = "none";
                            for (let i = 1; i < allRows.length; i++) {
                                if (allRows[i] !== row) {
                                    allRows[i].remove();
                                }
                            }
                        });

                        offersTable.append(row);
                    });

                    const result = {
                        loanId: loan.id,
                        isEligible: isEligible,
                        interestRate: interestRate,
                        offers: offers,
                    };

                    alert("Loan is approved");
                    resolve(result);
                    document.getElementById("viewOffers").style.display = "block";
                } else {
                    reject("Loan is rejected");
                    this.rejectedLoans.push(loan);
                    localStorage.setItem("rejectedLoans", JSON.stringify(this.rejectedLoans));
                    document.getElementById("applicationsOverview").style.display = "none";
                }
            }, 2000);
        })
            .catch((error) => {
                alert(error);
            });
    }

    takeOffer(loan, offer) {
        loan.selectedOffer = offer;
        loan.totalAmount = offer.totalAmount;
        this.allLoans.push(loan);
        localStorage.setItem("allLoans", JSON.stringify(this.allLoans));
        location.hash = "loansOverviewPage";
    }

    repayLoan(loanId) {
        const loanIndex = this.allLoans.findIndex((loan) => loan.id === loanId);
        if (loanIndex !== -1) {
            const repaidLoan = this.allLoans.splice(loanIndex, 1)[0];
            this.repaidLoans.push(repaidLoan);
            localStorage.setItem("allLoans", JSON.stringify(this.allLoans));
            localStorage.setItem("repaidLoans", JSON.stringify(this.repaidLoans));
        }
    }

    getAllLoans() {
        return {
            acceptedLoans: this.allLoans,
            rejectedLoans: this.rejectedLoans,
            repayedLoans: this.repaidLoans
        };
    }

    getTotalLoansAmount() {
        return this.allLoans.reduce((totalAmount, loan) => {
            return totalAmount + parseInt(loan.totalAmount);
        }, 0);
    }

    getRejectedLoansAmount() {
        return this.rejectedLoans.reduce((totalAmount, loan) => {
            return totalAmount + parseInt(loan.desiredAmount);
        }, 0);
    }

    getTotalMontlyPayment() {
        return this.allLoans.reduce((totalAmount, loan) => {
            return totalAmount + parseInt(loan.selectedOffer.monthlyPayment);
        }, 0);
    }
}


let loanManager = new LoanManager();




