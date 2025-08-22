export enum VehicleStatusEnum {
    InUse = "in_use",
    Charging = "charging",
    Available = "available",
}

export type Vehicle = {
    id: string;
    externalId?: string | null;
    name?: string | null;
    brand?: {
        id?: string;
        name?: string;
        createdAt?: string;
        createdBy?: string | null;
        updatedAt?: string;
        updatedBy?: string | null;
    } | null;
    model?: {
        id?: string;
        name?: string;
        batteryCapacity?: number;
        averageConsumption?: number;
        emissionGCO2?: number;
        Type?: string;
        createdAt?: string;
        createdBy?: string | null;
        updatedAt?: string;
        updatedBy?: string | null;
    } | null;
    vehicleStatus?: {
        id?: number;
        status?: VehicleStatusEnum;
        currentChargeLevel?: number;
        createdAt?: string;
        createdBy?: string | null;
        updatedAt?: string;
        updatedBy?: string | null;
    } | null;
    type?: string | null;
    createdAt?: string;
    createdBy?: string | null;
    updatedAt?: string;
    updatedBy?: string | null;
};

