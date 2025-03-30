import { BaseCommand } from './base-command';
import { ICommand } from './interfaces/icommand';

export class FindObjectCommand extends BaseCommand implements ICommand {

  private objects;
  private key;
  private result;
  constructor(options: any) {
    super();
    this.objects = options.objects;
    this.key = options.id;
  }

  execute(): Promise<void> {
    this.result = this.objects.get(this.key);
    return Promise.resolve();
  }

  getResult(){
    return this.result;
  }

  getType(): string {
    return 'FindObjectCommand';
  }
}