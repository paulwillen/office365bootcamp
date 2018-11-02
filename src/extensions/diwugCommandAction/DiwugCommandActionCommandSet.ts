import { override } from "@microsoft/decorators";
import { Log, UrlQueryParameterCollection } from "@microsoft/sp-core-library";

import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters
} from "@microsoft/sp-listview-extensibility";
import { Dialog } from "@microsoft/sp-dialog";

import * as strings from "DiwugCommandActionCommandSetStrings";

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IDiwugCommandActionCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
}

const LOG_SOURCE: string = "DiwugCommandActionCommandSet";

export default class DiwugCommandActionCommandSet extends BaseListViewCommandSet<
  IDiwugCommandActionCommandSetProperties
> {
  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, "Initialized DiwugCommandActionCommandSet");
    return Promise.resolve();
  }

  @override
  public onListViewUpdated(
    event: IListViewCommandSetListViewUpdatedParameters
  ): void {
    const compareOneCommand: Command = this.tryGetCommand("COMMAND_1");
    if (compareOneCommand) {
      // This command should be hidden unless exactly one row is selected.
      compareOneCommand.visible = event.selectedRows.length > 0;
    }
  }

  @override
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case "COMMAND_1":
        // console.log("entering command1");

        var itemsFromStorage = localStorage.getItem("DiwugBootcampStorage");
        // console.log(itemsFromStorage);
        var items = [];
        if (itemsFromStorage) {
          items = JSON.parse(localStorage.getItem("DiwugBootcampStorage"));
          // console.log(items);
        }
        // console.log(event.selectedRows[0].getValueByName("Title"));
        event.selectedRows.forEach(element => {
          items.push({
            Title: element.getValueByName("Title")
          });
        });

        // console.log("pushed item");
        // console.log(items);
        localStorage.setItem("DiwugBootcampStorage", JSON.stringify(items));
        break;
      case "COMMAND_2":
        Dialog.alert(`${this.properties.sampleTextTwo}`);
        break;
      default:
        throw new Error("Unknown command");
    }
  }
}
