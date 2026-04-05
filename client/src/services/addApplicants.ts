import type { Applicant, ResultEvaluate } from "@/types/evaluate_types";

export const createEmptyApplicant = (): Applicant => ({
  careerCategory: "",
  career: "",
  otherCareer: "",
  name: "",
  idCard: "",
  businessActivity: {
    salary: 0,
    otherSalary: 0,
    totalIncome: 0,
  },
  expenseItem: {
    costPercentage: 0,
    costAndService: 0,
    empSalary: 0,
    rentExpenses: 0,
    utilityExpenses: 0,
    otherExpenses: 0,
    totalExpense: 0,
  },
  profileLost: {
    grossProfit: 0,
    interestExpense: 0,
    profitBeforeTax: 0,
    taxExpense: 0,
    netProfit: 0,
  },
  shareHolder: {
    shareOfNetProfit: 0,
    bankNetProfit: 0,
  },
  optionalOtherExpense: 0,
  salary: {
    base: 0,
    freelanceIncome: 0,
    tax: 0,
    socialSecurityFund: 0,
    providentFund: 0,
    shareFund: 0,
    associationFund: 0,
    otherFund: 0,
    total: 0,
  },
  otherSalary: {
    entertainmentSalary: 0,
    livingSalary: 0,
    certificationSalary: 0,
    professionalAllowance: 0,
    transportationSalary: 0,
    academicSalary: 0,
    otherRegularSalary: 0,
    total: 0,
  },
  optionsSalary: {
    commission: 0,
    overtime: 0,
    bonus: 0,
    dividendsInterest: 0,
    netSupplementaryIncome: 0,
    other: 0,
    otherDocumentedIncome: 0,
    total: 0,
  },
});

export const createSampleApplicant = (): Applicant => ({
  careerCategory: "พนักงานบริษัท",
  career: "วิศวกรซอฟต์แวร์",
  otherCareer: "",
  name: "สมชาย ใจดี",
  idCard: "1234567890123",
  businessActivity: {
    salary: 50000,
    otherSalary: 10000,
    totalIncome: 60000,
  },
  expenseItem: {
    costPercentage: 30,
    costAndService: 5000,
    empSalary: 15000,
    rentExpenses: 8000,
    utilityExpenses: 2000,
    otherExpenses: 3000,
    totalExpense: 33000,
  },
  profileLost: {
    grossProfit: 27000,
    interestExpense: 1500,
    profitBeforeTax: 25500,
    taxExpense: 2000,
    netProfit: 23500,
  },
  shareHolder: {
    shareOfNetProfit: 23500,
    bankNetProfit: 18800,
  },
  optionalOtherExpense: 5000,
  salary: {
    base: 50000,
    freelanceIncome: 0,
    tax: 2500,
    socialSecurityFund: 750,
    providentFund: 5000,
    shareFund: 1000,
    associationFund: 500,
    otherFund: 250,
    total: 40250,
  },
  otherSalary: {
    entertainmentSalary: 2000,
    livingSalary: 3000,
    certificationSalary: 1000,
    professionalAllowance: 1500,
    transportationSalary: 2000,
    academicSalary: 500,
    otherRegularSalary: 1000,
    total: 11000,
  },
  optionsSalary: {
    commission: 5000,
    overtime: 3000,
    bonus: 10000,
    dividendsInterest: 2000,
    netSupplementaryIncome: 1500,
    other: 500,
    otherDocumentedIncome: 1000,
    total: 22500,
  },
});

export const createSampleApplicants = (count: number): Applicant[] => {
  return Array.from({ length: count }, (_, index) => ({
    ...createSampleApplicant(),
    name: `ผู้กู้คนที่ ${index + 1}`,
    idCard: `${1234567890123 + index}`,
  }));
};

export const createEmptyResult = (): ResultEvaluate => ({
  evaluateType: "",
  applicants: [],
  debtDetail: {
    debtAmount: 0,
    lastDebt: 0,
    debtReported: 0,
    debtNotReported: 0,
    lastDeduction: 0,
    totalDebt: 0,
  },
  dti: 0,
  dscr: 0,
});
