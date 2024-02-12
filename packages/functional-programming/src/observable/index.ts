/**
 * RxJS Observable Lifecycle
 * https://pks2974.medium.com/rxjs-%EA%B0%84%EB%8B%A8%EC%A0%95%EB%A6%AC-41f67c37e028
 */
export * from './object';

export class Observable {
  private observers: Observer[] = [];
  private producer?: (observer: Observer) => void;

  constructor(producer?: (observer: Observer) => void) {
    this.producer = producer;
  }

  static create(producer?: (observer: Observer) => void): Observable {
    return new Observable(producer);
  }

  subscribe(
    nextHandler: (data: any) => void,
    errorHandler: (err: any) => void,
    completeHandler: () => void,
  ): () => void {
    const observer = new Observer(nextHandler, errorHandler, completeHandler);
    this.observers.push(observer);

    if (this.producer) {
      this.producer(observer);
    }

    return () => {
      this.unsubscribe(observer);
    };
  }

  private unsubscribe(observer: Observer): void {
    this.observers = this.observers.filter(obs => obs !== observer);
  }
}

export class Observer {
  constructor(
    private nextHandler: (data: any) => void,
    private errorHandler: (err: any) => void,
    private completeHandler: () => void,
  ) {}
  // next : Observable 구독자에게 데이터를 전달한다.
  next(data: any): void {
    this.nextHandler(data);
  }
  // error : Observable 구독자에게 에러를 전달한다. 이후에 next 및 complete 이벤트가 발생하지 않는다.
  error(err: any): void {
    this.errorHandler(err);
  }
  // complete : Observable 구독자에게 완료 되었음을 알린다. next는 더 이상 데이터를 전달하지 않는다.
  complete(): void {
    this.completeHandler();
  }
}

// 예제 사용
const myObservable = Observable.create((observer: Observer) => {
  try {
    observer.next('item');
  } catch (e) {
    observer.error(e);
  } finally {
    observer.complete();
  }
});

const unsubscribe = myObservable.subscribe(
  x => console.log(x),
  err => console.error(err),
  () => console.log('complete'),
);

// 구독 취소
// unsubscribe();
