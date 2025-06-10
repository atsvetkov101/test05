import { Area } from './area';
import { AreaSystem } from './area-system';

interface ICreateAreaSystemOptions {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  stepX: number;
  initialShiftX: number;
  stepY: number;
  initialShiftY: number;
}

export class AreaSystemFactory {
  public static createAreaSystem( inputOptions: ICreateAreaSystemOptions ): AreaSystem {
    const options = {
      minX: 0,
      maxX: 100,
      minY: 0,
      maxY: 100,
      stepX: 10,
      initialShiftX: 0,
      stepY: 10,
      initialShiftY: 0,
      ...inputOptions,
    };
    const areaSystem = new AreaSystem();
    if(options.initialShiftX !== 0 && options.initialShiftY !== 0){
      // Добавляем начальную область (0, initialShiftX, 0, initialShiftY)
      const initialArea = new Area(0, options.initialShiftX, 0, options.initialShiftY);
      areaSystem.addArea(initialArea);
    }

    if(options.initialShiftX !== 0){
      const minX = 0;
      const maxX = options.initialShiftX;
       for (let y = options.minY + options.initialShiftY; y < options.maxY; y += options.stepY) {
        const area = new Area(
          minX,
          maxX,
          y,
          Math.min(y + options.stepY, options.maxY)
        );

        // Добавляем область в систему областей
        areaSystem.addArea(area);
       }
    }

    if(options.initialShiftY !== 0){
      const minY = 0;
      const maxY = options.initialShiftX;
      for (let x = options.minX + options.initialShiftX; x < options.maxX; x += options.stepX) {
        // Создаем новую область с заданными параметрами
        const area = new Area(
          x,
          Math.min(x + options.stepX, options.maxX),
          minY,
          maxY
        );

        // Добавляем область в систему областей
        areaSystem.addArea(area);
      }
    }

    for (let x = options.minX + options.initialShiftX; x < options.maxX; x += options.stepX) {
      for (let y = options.minY + options.initialShiftY; y < options.maxY; y += options.stepY) {
        // Создаем новую область с заданными параметрами
        const area = new Area(
          x,
          Math.min(x + options.stepX, options.maxX),
          y,
          Math.min(y + options.stepY, options.maxY)
        );

        // Добавляем область в систему областей
        areaSystem.addArea(area);
      }
    }
    return areaSystem;
  }
}
