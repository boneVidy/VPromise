支持 defer 的Promise
;;; `const asyncNumber = () => {
        const defer = VPromise.defer<number>();
        setTimeout(() => {
          defer.resolve(100);

        })

      return defer.promise;
    };
    
    asyncNumber.then(console.log);  ///100
    
    `