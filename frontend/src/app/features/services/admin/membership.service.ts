import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environment/environment';
import { ApiResponse } from '../../interfaces/public/api-response.interface';
import { MembershipPlanDto } from '../../interfaces/private/plans.interface';

@Injectable({ providedIn: 'root' })
export class MembershipService {
    private readonly http = inject(HttpClient);
    private readonly base = `${environment.apiUrl}/MembershipPlan`;

    getAll(): Observable<MembershipPlanDto[]> {
        return this.http.get<ApiResponse<MembershipPlanDto[]>>(this.base)
        .pipe(map(r => r.data));
    }
}