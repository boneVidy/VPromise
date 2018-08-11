export type VpromiseExcutor = (resolve:Resolve, reject:Reject) => any;
export type Resolve = (data: any) => void;
export type Reject = (reson: any) => void;
export type VPromiseStatus = 'pending' | 'fulfilled' | 'rejected';
export type OnFulfilled<TResult1> = ((value: TResult1) => TResult1 | PromiseLike<TResult1>) | undefined | null;
export type OnRejected<TResult2 = never> = ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null;
export type Defer<T> = {
  promise: Vpromise<T>;
  resolve: Resolve;
  reject: Reject;
}

export class Vpromise <T> implements PromiseLike<T>{
  private status:VPromiseStatus  = 'pending';
  private value:T | undefined = undefined;
  private reson: any;
  private resolveCbs:Function[] = [];
  private rejectCbs:Function[] = [];
  public static defer = <T>():Defer<T> => {
    let dfd = <Defer<T>>{};
    dfd.promise = new Vpromise<T>((resolve, reject) => {
      dfd.resolve = resolve;
      dfd.reject = reject;
    });
    return dfd;
  }
  public static resolve<T=undefined>(data?: T) {
    return new Vpromise<T>((resolve) =>{
      resolve(data);
    });
  }
  public static reject (reson: any) {
    return new Vpromise((resolve, reject) =>{
      reject(reson);
    });
  }
  
  // @ts-ignore
  public static all:PromiseConstructor['all'] = function (values: []){
    return new Vpromise((resolve, reject) => {
      const {length} = values;
      const results:any[] = [];
      let count = 0;
      for (let i = 0; i < length; i++) {
        const currentVal = values[i];
        if (isPromise(currentVal)) {
          (currentVal as PromiseLike<any>).then((data) => {
            results[i] = data;
            count++;
            if (length === count) {
              resolve(results);
            }
          }, reject)  
        } else {
          results[i] = currentVal;
        }
      }
      
    });
  }

  
  constructor (excutor: VpromiseExcutor) {
    const resolve = (data: T) => {
      if (this.status === 'pending') {
        this.status = 'fulfilled';
        this.value = data;
        this.resolveCbs.forEach(cb => cb(this.value));
      }
    };
    const reject = (reson: any) => {
      if (this.status === 'pending') {
        this.status ='rejected';
        this.reson = reson;
        this.rejectCbs.forEach(cb => cb(reson));
      }
    }
    try {
      excutor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  public then<TResult1 = T, TResult2 = never>
  (onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
   onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): PromiseLike<TResult1 | TResult2> 
   {
    const onFulfilledHandler:Function = typeof onfulfilled === 'function'? onfulfilled: () => onfulfilled;
    const onRejectedHandler:Function = typeof onrejected === 'function'? onrejected: () => onrejected;
    
    const self = this;
    const newPromise =  new Vpromise<TResult1 | TResult2>( function (resolve, reject){
      
        if (self.status === 'fulfilled') {
          // @ts-ignore

          setTimeout(() => {
            try {
              const value = onFulfilledHandler(self.value)
              resolvePromise(newPromise, value, resolve, reject);
            } catch (error) {
              reject(error);
            }
            
          }, 0);
        }
        if (self.status === 'rejected') {
          // @ts-ignore
          setTimeout(() => {
            try {
              const value = onRejectedHandler(self.reson);
              resolvePromise(newPromise, value, resolve, reject);
            } catch (error) {
              reject(error);
            }
            
          }, 0);
        }
        if (self.status === 'pending') {
          onFulfilledHandler && self.resolveCbs.push(() => {
          // @ts-ignore

            setTimeout(() => {
              
              try {
                const value = onFulfilledHandler(self.value)
                resolvePromise(newPromise, value, resolve, reject);
              } catch (error) {
                reject(error);
              }
              
            }, 0);
          });
          onRejectedHandler && self.rejectCbs.push(() => {
          // @ts-ignore

            setTimeout(() => {
              
              try {
                const value = onRejectedHandler(self.reson);
                resolvePromise(newPromise, value, resolve, reject);
              } catch (error) {
                reject(error);
              }
              
            }, 0);
          });
        }
      
      
    });
    return newPromise;
  }

  public catch<TResult = never>
  (onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult> {
    const onRejectedHandler = typeof onrejected === 'function'? onrejected: () => onrejected;
    //@ts-ignore
    return this.then(null, onRejectedHandler);
  }
}

const resolvePromise = <T=any>(promise: Vpromise<T>, value: any, resolve: Resolve, reject: Reject) => {
  if (promise === value) {
    return reject(new TypeError("chaing cycle"));
  }
  let isCalled = false;
  if (value !== null && (typeof value === 'object' || typeof value === 'function') ) {
    if (value.then) {
      try {
        const then = value.then;
        if (typeof then === 'function') {
          then.call(value, (newV: any) => {
            if (isCalled) {
              return;
            }
            isCalled = true;
            resolvePromise(promise, newV, resolve, reject);
          }, (e: any) => {
            if (isCalled) {
              return;
            }
            isCalled = true;
            reject(e);
          });
        } else {
          resolve(value);
        }
        
      } catch (error) {
        reject(error);
      }
    } else {
      resolve(value);
    }
    
  } else {
    resolve(value);
  }
}


function isPromise(obj: any) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}