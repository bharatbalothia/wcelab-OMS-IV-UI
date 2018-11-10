import { ArrayListPipe } from './array-list.pipe';

describe('ArrayListPipe', () => {
  it('create an instance', () => {
    const pipe = new ArrayListPipe();
    expect(pipe).toBeTruthy();
  });
});
