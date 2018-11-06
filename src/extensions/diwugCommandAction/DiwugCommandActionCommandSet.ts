import { override } from "@microsoft/decorators";
import { Log, UrlQueryParameterCollection } from "@microsoft/sp-core-library";

import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters
} from "@microsoft/sp-listview-extensibility";
import { Dialog } from '@microsoft/sp-dialog';

import { sp, ItemAddResult } from "@pnp/sp";

import * as strings from "DiwugCommandActionCommandSetStrings";
import { IClipboardItem } from "../../models/ClipboardItem";

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IDiwugCommandActionCommandSetProperties {
}

const LOG_SOURCE: string = "DiwugCommandActionCommandSet";

const LocalStorageKey: string = "DiwugBootcampStorage";

export default class DiwugCommandActionCommandSet extends BaseListViewCommandSet<IDiwugCommandActionCommandSetProperties>
{
  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, "Initialized DiwugCommandActionCommandSet");
    return Promise.resolve();
  }

  @override
  public onListViewUpdated(
    event: IListViewCommandSetListViewUpdatedParameters
  ): void {
    const copyCommand: Command = this.tryGetCommand("COMMAND_1");
    if (copyCommand) {
      // This command should be hidden unless one or more rows are selected.
      copyCommand.visible = event.selectedRows.length > 0;
    }

    const pasteCommand: Command = this.tryGetCommand("COMMAND_2");
    if (pasteCommand) {
      pasteCommand.visible = this.getClipboardItems().length > 0;
    }
  }

  @override
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case "COMMAND_1":
        this.onCopy(event);
        break;
      case "COMMAND_2":
        this.onPaste();
        break;
      default:
        throw new Error("Unknown command");
    }
  }

  private onCopy = (event: IListViewCommandSetExecuteEventParameters) => {
    const itemsFromStorage = this.getClipboardData();
    let items: IClipboardItem[] = [];
    if (itemsFromStorage) {
      items = JSON.parse(itemsFromStorage);
    }
    event.selectedRows.forEach(element => {
      items.push({
        Title: element.getValueByName("Title")
      });
    });

    this.setClipboardData(items);
  }

  private onPaste = () => {
    try {
      const listUrl: string = this.context.pageContext.list.serverRelativeUrl;

      const clipboardItems = this.getClipboardItems();

      for (let clipboardItem of clipboardItems) {
        sp.web.getList(listUrl)
          .items.add(clipboardItem)
          .then((result: ItemAddResult) => { })
          .catch(reason => Dialog.alert(`Error pasting: ${reason}`));
      }
    }
    catch (ex) {
      Dialog.alert(`Error executing paste: ${ex}`);
    }
  }

  private getClipboardItems = (): IClipboardItem[] => {
    const dataStr: string = this.getClipboardData();

    return dataStr ? JSON.parse(dataStr) : [];
  }

  private getClipboardData = (): string =>
    localStorage.getItem(LocalStorageKey)

  private setClipboardData = (items: IClipboardItem[]): void =>
    localStorage.setItem(LocalStorageKey, JSON.stringify(items))
}
