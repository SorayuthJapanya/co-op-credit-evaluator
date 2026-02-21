
export interface ICareerCategory {
    id: string;
    categoryName: string;
    subCategory: ISubCareer[];
    createdAt: string;
    updatedAt: string;
}

export interface ISubCareer {
    id: string;
    categoryId: string;
    subCategoryName: string;
    subNetProfit: number;
    createdAt: string;
    updatedAt: string;
}

export interface IManageSubCareer {
    categoryId: string;
    subCategoryName: string;
    subNetProfit: number;
}