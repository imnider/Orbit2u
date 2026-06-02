// features/services/models/plans.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environment/environment';
import {MembershipPlanDto, MembershipPlanListResponse, MembershipPlanResponse,CoinPackageDto, CoinPackageListResponse, CoinPackageResponse} from '../../interfaces/private/plans.interface';

@Injectable({ providedIn: 'root' })
export class PlansService {
    private readonly http = inject(HttpClient);

    //peticiones de obtener todos y luego por id
    getAllMembershipPlans(): Observable<MembershipPlanDto[]> {
        return this.http
        .get<MembershipPlanListResponse>(`${environment.apiUrl}/MembershipPlan`)
        .pipe(map(r => r.data));
    }

    getMembershipPlanById(id: number): Observable<MembershipPlanDto> {
        return this.http
        .get<MembershipPlanResponse>(`${environment.apiUrl}/MembershipPlan/${id}`)
        .pipe(map(r => r.data));
    }

    getAllCoinPackages(): Observable<CoinPackageDto[]> {
        return this.http
        .get<CoinPackageListResponse>(`${environment.apiUrl}/CoinPackage`)
        .pipe(map(r => r.data));
    }

    getCoinPackageById(id: number): Observable<CoinPackageDto> {
        return this.http
        .get<CoinPackageResponse>(`${environment.apiUrl}/CoinPackage/${id}`)
        .pipe(map(r => r.data));
    }
}