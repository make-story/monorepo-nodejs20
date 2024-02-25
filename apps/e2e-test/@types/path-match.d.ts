declare module 'path-match' {
  interface Key {
    name: string;
    delimiter: string;
    optional: boolean;
    repeat: boolean;
  }

  interface Params {
    [key: string]: string | string[] | undefined;
  }

  interface MatchFunction {
    (pathname: string | undefined, params?: Params): Params | false | any;
  }

  interface PathMatchOptions {
    sensitive?: boolean;
    strict?: boolean;
    end?: boolean;
  }

  interface PathMatchFactory {
    (options?: PathMatchOptions): MatchFunction;
  }

  const createPathMatch: PathMatchFactory;

  export = createPathMatch;
}
