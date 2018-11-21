import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer, PlaceholderContent, PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'CopyPasteFooterApplicationCustomizerStrings';

import "./AppCustomizer.module.scss";

const LOG_SOURCE: string = 'CopyPasteFooterApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ICopyPasteFooterApplicationCustomizerProperties {
  Top: string;
  Bottom: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class CopyPasteFooterApplicationCustomizer
  extends BaseApplicationCustomizer<ICopyPasteFooterApplicationCustomizerProperties> {

  private _bottomPlaceholder: PlaceholderContent | undefined;

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    // Wait for the placeholders to be created (or handle them being changed) and then
    // render.
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);

    return Promise.resolve<void>();
  }

  private _renderPlaceHolders(): void {
    console.log("HelloWorldApplicationCustomizer._renderPlaceHolders()");
    console.log(
      "Available placeholders: ",
      this.context.placeholderProvider.placeholderNames
        .map(name => PlaceholderName[name])
        .join(", ")
    );


    // Handling the bottom placeholder
    if (!this._bottomPlaceholder) {
      this._bottomPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Bottom,
        { onDispose: this._onDispose }
      );

      // The extension should not assume that the expected placeholder is available.
      if (!this._bottomPlaceholder) {
        console.error("The expected placeholder (Bottom) was not found.");
        return;
      }

      if (this.properties) {
        let bottomString: string = this.properties.Bottom;
        if (!bottomString) {
          bottomString = "(Bottom property was not defined.)";
        }

        if (this._bottomPlaceholder.domElement) {
          // styles.app
          // styles.bottom
          this._bottomPlaceholder.domElement.innerHTML = `
                    <div class="copyPasteFooter">
                        <div class="bottom">
                          <span id="footerWithTitles">
                            <i>Loading....</i>
                          </span>
                          &nbsp;&nbsp;
                           <a href="#" id="footerWithTitlesClear" style="color: white; display:none; text-decoration:underline" onclick="javascript: localStorage.removeItem('DiwugBootcampStorage'); return false;">(Clear)</a>

                        </div>

                    </div>`;
        }
      }


      window.setInterval(this.updateTitlesInFooter, 1000);

    }
  }

  private updateTitlesInFooter() {
    var footerWithTitles = document.getElementById("footerWithTitles");
    var clearLink = document.getElementById("footerWithTitlesClear");
    var clipBoardItems = JSON.parse(localStorage.getItem("DiwugBootcampStorage"));
    if (clipBoardItems == null || clipBoardItems.length == 0) {
      footerWithTitles.innerHTML = "<i>No items copied</i>";
      clearLink.style.display = "none";
    } else {
      var innerHtml = "These items have been selected: ";
      var itemsHtml = "";
      clipBoardItems.forEach(item => {
        itemsHtml += "'" + item.Title + "', ";
      });

      footerWithTitles.innerHTML = innerHtml + itemsHtml.substring(0, itemsHtml.length - 2);
      clearLink.style.display = "initial";
    }

  }


  private _onDispose(): void {
    console.log('[HelloWorldApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
  }
}
