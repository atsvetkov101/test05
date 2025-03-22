export interface IUseFuel {

  getFuel(): number;

  refuel(amount: number): void;

  burn(amount: number): void;

  ableToMove(): boolean;


}