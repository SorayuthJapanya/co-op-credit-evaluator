export interface BusinessActivity {
  salary: number;
  otherSalary: number;
  totalIncome: number;
}

export interface ExpenseItem {
  costPercentage: number;
  costAndService: number;
  empSalary: number;
  rentExpenses: number;
  utilityExpenses: number;
  otherExpenses: number;
  totalExpense: number;
}

export interface ProfileLost {
  grossProfit: number;
  interestExpense: number;
  profitBeforeTax: number;
  taxExpense: number;
  netProfit: number;
}

export interface ShareHolder {
  shareOfNetProfit: number;
  bankNetProfit: number;
}

export interface SalaryDetails {
  base: number;
  tax: number;
  socialSecurityFund: number;
  providentFund: number;
  shareFund: number;
  associationFund: number;
  otherFund: number;
  total: number;
}

export interface OtherSalaryDetails {
  entertainmentSalary: number;
  livingSalary: number;
  certificationSalary: number;
  professionalAllowance: number;
  transportationSalary: number;
  academicSalary: number;
  otherRegularSalary: number;
  total: number;
}

export interface OptionsSalary {
  commission: number;
  overtime: number;
  bonus: number;
  dividendsInterest: number;
  netSupplementaryIncome: number;
  other: number;
  otherDocumentedIncome: number;
  total: number;
}

export interface BorrowerData {
  careerCategory: string;
  career: string;
  otherCareer: string;
  name: string;
  idCard: string;
  businessActivity: BusinessActivity;
  expenseItem: ExpenseItem;
  profileLost: ProfileLost;
  shareHolder: ShareHolder;
  optionalOtherExpense: number;
  salary: SalaryDetails;
  otherSalary: OtherSalaryDetails;
  optionsSalary: OptionsSalary;
}

export interface Applicant {
  careerCategory: string;
  career: string;
  otherCareer: string;
  name: string;
  idCard: string;
  businessActivity: BusinessActivity;
  expenseItem: ExpenseItem;
  profileLost: ProfileLost;
  shareHolder: ShareHolder;
  optionalOtherExpense: number;
  salary: SalaryDetails;
  otherSalary: OtherSalaryDetails;
  optionsSalary: OptionsSalary;
}

export interface ResultBorrowerData {
  name: string,
  idCard: string,
  salary: number,
  expenses: number,
  otherSalary: number,
  optionsSalary: number,
  resultShareValue: number,
  totalSalary: number,
  resultIncome: number,
  customerExpenses: number,
  resultCustomerExpenses: number,
  livingExpenses: number,
  otherExpenses: number,
  totalExpenses: number,
}

export interface DebtDetail {
  debtAmount: number,
  lastDebt: number,
  debtReported: number,
  debtNotReported: number,
  lastDeduction: number,
  totalDebt: number,
}

export interface ResultEvaluate {
  evaluateType: string,
  applicants: ResultBorrowerData[],
  debtDetail: DebtDetail,
  dti: number,
  dscr: number
}

export interface ICreateEvaluate {
  evaluateType: string;
  marginType : string;
  applicants: Applicant[];
  result: ResultEvaluate
}

export interface Evaluate {
  id: string;
  userId: string;
  evaluateType: string;
  marginType: string;
  applicants: Applicant[];
  result: ResultEvaluate;
  createdAt: string;
  updatedAt: string;
}
