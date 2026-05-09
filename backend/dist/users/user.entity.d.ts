export declare enum UserRole {
    TENANT = "tenant",
    PROPERTY_MANAGER = "property_manager",
    LANDLORD = "landlord"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
}
