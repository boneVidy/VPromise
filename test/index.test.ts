import { Vpromise } from "../src";

describe('Vpromise test', () => {
  test('should result is an array', async () => {
    expect.assertions(1);
    const result = await Vpromise.all([1,2,3,4,5]);
    expect(result).toBeInstanceOf(Array);

  });
  test('if params is not a PromiseLike Array  also can get results',async () => {
    expect.assertions(1);
    const result = await Vpromise.all([1,2,3,4,5]);
    expect(result).toMatchObject([1,2,3,4,5]);

  });

  test('should use settimeout in Vpromise can return the correct value', async () => {
    const asyncGetNumber = () => {
      return new Vpromise((resolve, reject) => {
        setTimeout(() => {
          resolve(100);
        })
      })
    }
    expect.assertions(1);
    const result = await asyncGetNumber();
    expect(result).toBe(100);
  });
});