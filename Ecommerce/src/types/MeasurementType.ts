interface MeasurementBase {
  name: string;
  unit: string;
}

export interface CreateMeasurementType extends MeasurementBase {}

export interface MeasurementType extends MeasurementBase {
  id: number;
}

export interface UpdateMeasurementType extends Partial<MeasurementBase> {}
