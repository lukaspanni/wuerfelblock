export abstract class PersistenceService {
  constructor() {}

  public abstract store(key: string, data: string): Promise<void>;
  public abstract retrieve(key: string): Promise<string>;
  public abstract clear(): Promise<void>;
  public abstract keys(): Promise<string[]>;
}
