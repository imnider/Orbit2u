export interface MembershipPlanDto {
    membershipPlanId: number;
    displayName: string;
    description: string | null;
    monthlyPrice: number;
    coinsReward: number;
    maxCommunities: number;
    maxVideosPerCommunity: number;
}

export interface MembershipPlanListResponse {
    data: MembershipPlanDto[];
}

export interface MembershipPlanResponse {
    data: MembershipPlanDto;
}

export interface CoinPackageDto {
    coinPackageId: number;
    displayName: string;
    description: string | null;
    price: number;
    coinsAmount: number;
}

export interface CoinPackageListResponse {
    data: CoinPackageDto[];
}

export interface CoinPackageResponse {
    data: CoinPackageDto;
}