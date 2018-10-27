export class IdGenerator {
  current: number = 0;

  next() {
    this.current++;
    return 'n' + this.current.toString();
  }
}