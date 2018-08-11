export type VpromiseExcutor = (resolve:Resolve, reject:Reject) => any;
export type Resolve = (data: any) => void;
export type Reject = (reson: any) => void;
export type VPromiseStatus = 'pending' | 'fulfilled' | 'rejected';
export type OnFulfilled<T> = (data?: T) => any;
export type OnRejected = (reson?: any) => any;
export type Defer<T> = {
  promise: Vpromise<T>;
  resolve: Resolve;
  reject: Reject;
}
export class Vpromise <T = undefined>{
  private status:VPromiseStatus  = 'pending';
  private value:T | undefined = undefined;
  private reson: any;
  private resolveCbs:OnFulfilled<T>[] = [];
  private rejectCbs:OnRejected[] = [];
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
  public then (onFulfilled?: OnFulfilled<T>, onRejected?: OnRejected) {
    const onFulfilledHandler = typeof onFulfilled === 'function'? onFulfilled: () => onFulfilled;
    const onRejectedHandler = typeof onRejected === 'function'? onRejected: () => onRejected;
    
    const self = this;
    const newPromise =  new Vpromise( function (resolve, reject){
      
        if (self.status === 'fulfilled') {
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
            setTimeout(() => {
              
              try {
                const value = onFulfilledHandler(self.value)
                resolvePromise(newPromise, value, resolve, reject);
              } catch (error) {
                reject(error);
              }
              
            }, 0);
          });
          onRejected && self.rejectCbs.push(() => {
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

  public catch (onRejected?: OnRejected) {
    onRejected = typeof onRejected === 'function'? onRejected: () => onRejected;
    return this.then(() => {}, onRejected);
  }
}

const resolvePromise = (promise: Vpromise, value: any, resolve: Resolve, reject: Reject) => {
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


