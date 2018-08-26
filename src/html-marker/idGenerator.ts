export class IdGenerator {
  current: number = 0;

  next() {
    this.current++;
    return this.current.toString();
  }
}