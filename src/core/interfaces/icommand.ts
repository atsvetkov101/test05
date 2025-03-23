export interface ICommand {

  execute(): Promise<void>;
  getType(): string;
  setTarget?( arg0: object ): void;
}
