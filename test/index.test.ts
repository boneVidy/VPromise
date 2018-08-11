import { Vpromise } from "../src";

const asyncGetNumber = (n =100,time = 300) => {
  return new Vpromise((resolve, reject) => {
    setTimeout(() => {
      resolve(n);
    }, time)
  } )
}
describe('Vpromise test', () => {
  test('test Vpromise.defer', async () => {
    const asyncGetNumber = () => {
      const defer = Vpromise.defer<number>();
      setTimeout(() => {
        defer.resolve(100);
      })
      return defer.promise;
    }
    expect.assertions(1);
    const result = await asyncGetNumber();
    expect(result).toBe(100);
  });
  test('should result is an array', async () => {
    expect.assertions(1);
    const result = await Vpromise.all([1,2,3,4,5]);
    expect(result).toBeInstanceOf(Array);

  });
  test('if params is not a PromiseLike Array can  also  get results',async () => {
    expect.assertions(1);
    const result = await Vpromise.all([1,2,3,4,5]);
    expect(result).toMatchObject([1,2,3,4,5]);
  });
  test('if params is  a PromiseLike Array can  also  get results',async () => {
    expect.assertions(1);
    const result = await Vpromise.all([
      asyncGetNumber(1),
      asyncGetNumber(2,100),
      asyncGetNumber(3,30)
    ]);
    console.log('====================================');
    console.log(result);
    console.log('====================================');
    expect(result).toMatchObject([1,2,3]);

  });
  test('should use settimeout in Vpromise can return the correct value', async () => {
    
    expect.assertions(1);
    const result = await asyncGetNumber();
    expect(result).toBe(100);
  });

  test('should when promise throw a error, can catch the error by use catch method', async () => {
    const asyncFn = () => {
      return new Vpromise((resolve, reject) => {
        throw new Error("test");
      });
    }
    expect.assertions(1);
    try {
      const vp = await asyncFn();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
  test('should when promise reject a error, can catch the error by use catch method', async () => {
    const asyncFn = () => {
      return new Vpromise((resolve, reject) => {
        reject("test error")
      });
    }
    expect.assertions(1);
    try {
      const vp = await asyncFn();
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      expect(error).toBe("test error");
    }
  });
});