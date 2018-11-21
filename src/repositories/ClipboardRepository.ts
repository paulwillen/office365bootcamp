import { IClipboardItem } from "../models/ClipboardItem";

export class ClipboardRepository {

  private readonly LocalStorageKey: string = "DiwugBootcampStorage";

  public getItemCount = (): number => this.getItems().length;

  public getItems = (): IClipboardItem[] => {
    const dataStr: string = this.getData();

    return dataStr ? JSON.parse(dataStr) : [];
  }

  private getData = (): string =>
    localStorage.getItem(this.LocalStorageKey)

  public setItems = (items: IClipboardItem[]): void =>
    localStorage.setItem(this.LocalStorageKey, JSON.stringify(items))
}
