import { Vpromise } from "../src";

describe('Vpromise test', () => {
  it('should result is an array', async () => {
    expect.assertions(1);
    const result = await Vpromise.all([1,2,3,4,5]);
    expect(result).toBeInstanceOf(Array);

  });
  it('if params is not a PromiseLike Array  also can get results',async () => {
    expect.assertions(1);
    const result = await Vpromise.all([1,2,3,4,5]);
    expect(result).toMatchObject([1,2,3,4,5]);

  });

  it('should defer.promise can return a promise', () => {
    const asyncGetNumber = () => {
      return new Vpromise((resolve, reject) => {
        setTimeout(() => {
          resolve(100);
        })
      })
    }
    // expect.assertions(1);
    asyncGetNumber().then((value) => {
      expect(value).toBe(100);
    })
    

  });
});