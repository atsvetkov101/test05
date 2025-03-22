import { GameObject } from './game-object';
import { Point } from './point';
import { instance } from './programm';
import { RotateCommand } from './rotate-command';
import { Rotation } from './rotation';
import { StraightMoveCommand } from './straight-move-command';
import { StraightMovement } from './straight-movement';
import { Vector } from './vector';
export const main = instance.main;

const objects: GameObject[] = [];

const spaceShip = new GameObject();
spaceShip.setLocation(new Point(1, 0));
spaceShip.setVelocity(new Vector(2, 3));
objects.push(spaceShip);

const rocket = new GameObject();
rocket.setLocation(new Point(-1, 1));
rocket.setVelocity(new Vector(1, -2));
objects.push(rocket);

const command1 = new StraightMoveCommand();
command1.setTarget(spaceShip);

const command2 = new RotateCommand();
command2.setTarget(rocket);

const commands = [command1, command2];

instance.setQueue(commands);
// export const main = (): string => 'Hello World';

console.log(main());

console.log('');