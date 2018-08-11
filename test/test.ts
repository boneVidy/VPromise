import { Vpromise } from "../src";
describe('Vpromise test', () => {
  it('should result is an array', () => {
    Vpromise.all([1,2,3,4]).then((value) => {
      expect(value).toBeInstanceOf(Array);
    })
  });
  it('if params is not a PromiseLike Array  also can get results', () => {
    Vpromise.all([1,2,3,4]).then((value) => {
      expect(value).toMatchObject([1,2,3,4]);
    })
  });
});