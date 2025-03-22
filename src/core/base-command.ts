import { logger } from './logger';
import { Point } from './point';
import { Vector } from './vector';

export class BaseCommand {
  target: any;
  verbose: boolean;
  logger: any;

  constructor(){
    this.verbose = process.env.VERBOSE_LOGGING == 'true';
    this.logger = logger;
  }
  logTarget() {
    if(this.target && this.verbose) {
      const point: Point = this.target?.getLocation();
      const vector: Vector = this.target?.getVelocity();
      this.logger.log(`Point: ${point.toString() || '-'} vector: ${vector.toString() || '-'}`);
    }
  }
}