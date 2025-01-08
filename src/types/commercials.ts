// // src/types/commercials.ts
export interface Course {
  name: string;
}

export interface CategoryCommercial {
  courses: Course[];
  meraMasterShare: number;
  tenantShare: number;
}

export interface BankDetails {
  accountName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  typeOfAccount: string;
  GstNumber: string;
}

export interface CommercialState {
  categoryA: CategoryCommercial;
  categoryB: CategoryCommercial;
  categoryC: CategoryCommercial;
  addOn: CategoryCommercial;
  bankDetails: BankDetails;
  loading: boolean;
  success: boolean;
  error: string | null;
}

export interface CreateCommercialPayload {
  categoryA: CategoryCommercial;
  categoryB: CategoryCommercial;
  categoryC: CategoryCommercial;
  addOn: CategoryCommercial;
  bankDetails: BankDetails;
}







// export interface CommercialData {
//     categoryA: CategoryData;
//     categoryB: CategoryData;
//     categoryC: CategoryData;
//     addOn: AddOnData;
//     bankDetails: BankDetailsData;
//   }
  
//   export interface CategoryData {
//     courses: string;
//     meraMasterShare: number;
//     tenantShare: number;
//   }
  
//   export interface AddOnData {
//     meraMasterShare: number;
//     tenantShare: number;
//   }
  
//   export interface BankDetailsData {
//     accountName: string;
//     bankName: string;
//     accountNumber: string;
//     ifscCode: string;
//     branchName: string;
//     accountType: string;
//   }
  
//   export const initialCommercialState: CommercialData = {
//     categoryA: {
//       courses: '',
//       meraMasterShare: 0,
//       tenantShare: 0
//     },
//     categoryB: {
//       courses: '',
//       meraMasterShare: 0,
//       tenantShare: 0
//     },
//     categoryC: {
//       courses: '',
//       meraMasterShare: 0,
//       tenantShare: 0
//     },
//     addOn: {
//       meraMasterShare: 0,
//       tenantShare: 0
//     },
//     bankDetails: {
//       accountName: '',
//       bankName: '',
//       accountNumber: '',
//       ifscCode: '',
//       branchName: '',
//       accountType: ''
//     }
//   };