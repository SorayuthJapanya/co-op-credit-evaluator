export interface IMember {
    id: string;
    cooperativeId: string;
    idCard: string;
    accountYear: string;
    memberId: string;
    fullName: string;
    nationality: string;
    sharesNum: number;
    sharesValue: number;
    joiningDate?: string;
    memberType: number;
    leavingDate?: string;
    address: string;
    moo: string;
    subdistrict: string;
    district: string;
    province: string;    
}

export interface ICreateMemberRequest {
    cooperativeId: string;
    idCard: string;
    accountYear: string;
    memberId: string;
    fullName: string;
    nationality: string;
    sharesNum: number;
    sharesValue: number;
    joiningDate?: string;
    memberType: number;
    leavingDate?: string;
    address: string;
    moo: number;
    subdistrict: string;
    district: string;
    province: string;
}

export interface IUpdateMemberRequest {
    id: string;
    cooperativeId: string;
    idCard: string;
    accountYear: string;
    memberId: string;
    fullName: string;
    nationality: string;
    sharesNum: number;
    sharesValue: number;
    joiningDate?: string;
    memberType: number;
    leavingDate?: string;
    address: string;
    moo: number;
    subdistrict: string;
    district: string;
    province: string;
}

export interface IFilterMemberRequest {
    fullName: string;
    subdistrict: string;
    district: string;
    province: string;
    limit: number;
    page: number;
}