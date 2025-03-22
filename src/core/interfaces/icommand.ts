export interface ICommand {

  execute(): void;
  getType(): string;
  setTarget( arg0: object ): void;
}
