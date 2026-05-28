//generic response
export interface ApiResponse<T>{
    message: string;
    errors: string[];
    timeStamp: string;
    data: T;
}