export interface NotUniqueError<T> {
  fields: Array<keyof T>
}
