export declare type VpromiseExcutor = (resolve: Resolve, reject: Reject) => any;
export declare type Resolve = (data: any) => void;
export declare type Reject = (reson: any) => void;
export declare type VPromiseStatus = 'pending' | 'fulfilled' | 'rejected';
export declare type OnFulfilled<TResult1> = ((value: TResult1) => TResult1 | PromiseLike<TResult1>) | undefined | null;
export declare type OnRejected<TResult2 = never> = ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null;
export declare type Defer<T> = {
    promise: Vpromise<T>;
    resolve: Resolve;
    reject: Reject;
};
export declare class Vpromise<T> implements PromiseLike<T> {
    private status;
    private value;
    private reson;
    private resolveCbs;
    private rejectCbs;
    static defer: <T_1>() => Defer<T_1>;
    static resolve<T = undefined>(data?: T): Vpromise<T>;
    static reject(reson: any): Vpromise<{}>;
    static all: PromiseConstructor['all'];
    static race: PromiseConstructor['race'];
    constructor(excutor: VpromiseExcutor);
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): PromiseLike<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
}
