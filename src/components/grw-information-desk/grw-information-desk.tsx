import { Component, Host, h, Prop, State, Event, EventEmitter, getAssetPath, Build } from '@stencil/core';
import state from 'store/store';
import { translate } from 'i18n/i18n';
import { InformationDesk, Trek } from 'types/types';
import { getDataInStore } from 'services/grw-db.service';

@Component({
  tag: 'grw-information-desk',
  styleUrl: 'grw-information-desk.scss',
  shadow: true,
})
export class GrwInformationDeskDetail {
  descriptionRef?: HTMLDivElement;
  @Event() centerOnMap: EventEmitter<{ latitude: number; longitude: number }>;
  @State() displayShortDescription = true;
  @State() showInformationDeskDescriptionButton = false;
  @Prop() informationDesk: InformationDesk;

  @State() offline = false;
  @State() showDefaultImage = false;

  componentDidLoad() {
    this.handleOffline();
    if (this.descriptionRef) {
      this.showInformationDeskDescriptionButton = this.descriptionRef.clientHeight < this.descriptionRef.scrollHeight;
    }
  }

  handleInformationDeskDescription() {
    this.displayShortDescription = !this.displayShortDescription;
  }

  handleCenterOnMap() {
    this.centerOnMap.emit({ latitude: this.informationDesk.latitude, longitude: this.informationDesk.longitude });
  }

  async handleOffline() {
    if (this.informationDesk) {
      const trekInStore: Trek = await getDataInStore('treks', state.currentTrek.id);
      const informationDeskInStore: InformationDesk = await getDataInStore('informationDesks', this.informationDesk.id);
      this.offline = trekInStore && trekInStore.offline && Boolean(informationDeskInStore);
    }
  }

  render() {
    const defaultImageSrc = getAssetPath(`${Build.isDev ? '/' : ''}assets/default-image.svg`);
    return (
      <Host>
        {this.informationDesk.photo_url && (
          <div part="information-desk-img-container" class="information-desk-img-container">
            <img
              part="information-desk-img"
              class="information-desk-img"
              /* @ts-ignore */
              crossorigin="anonymous"
              src={this.informationDesk.photo_url}
              loading="lazy"
              /* @ts-ignore */
              onerror={event => {
                event.target.onerror = null;
                event.target.src = defaultImageSrc;
              }}
            />
          </div>
        )}
        <div part="information-desk-sub-container" class="information-desk-sub-container">
          {this.informationDesk.name && (
            <div part="information-desk-name" class="information-desk-name">
              {this.informationDesk.name}
            </div>
          )}
          {this.informationDesk.latitude && this.informationDesk.longitude && (
            <button part="center-on-map-button" class="center-on-map-button" onClick={() => this.handleCenterOnMap()}>
              {/* @ts-ignore */}
              <span part="icon" class="material-symbols material-symbols-outlined icon" translate={false}>
                location_searching
              </span>
              <span part="label">{translate[state.language].centerOnMap}</span>
            </button>
          )}
          {(this.informationDesk.postal_code || this.informationDesk.municipality || this.informationDesk.street) && (
            <div part="information-desk-informations" class="information-desk-informations">
              {this.informationDesk.postal_code && this.informationDesk.postal_code}
              {this.informationDesk.municipality && ` ${this.informationDesk.municipality}`}
              {this.informationDesk.street && ` ${this.informationDesk.street}`}
            </div>
          )}
          {this.informationDesk.phone && (
            <div class="phone-container">
              {/* @ts-ignore */}
              <span part="icon" class="material-symbols material-symbols-outlined icon" translate={false}>
                call
              </span>
              <a part="label" class="label" href={`tel:${this.informationDesk.phone}`}>
                {this.informationDesk.phone}
              </a>
            </div>
          )}
          {this.informationDesk.email && (
            <div part="mail-container" class="mail-container">
              {/* @ts-ignore */}
              <span part="icon" class="material-symbols material-symbols-outlined icon" translate={false}>
                mail
              </span>
              <a part="label" class="label" href={`mailto:${this.informationDesk.email}`}>
                {this.informationDesk.email}
              </a>
            </div>
          )}
          {this.informationDesk.website && (
            <div part="link-container" class="link-container">
              {/* @ts-ignore */}
              <span part="icon" class="material-symbols material-symbols-outlined icon" translate={false}>
                link
              </span>
              <a part="label" class="label" href={`${this.informationDesk.website}`}>
                {this.informationDesk.website}
              </a>
            </div>
          )}
          {this.informationDesk.description && (
            <div part="information-desk-description-container" class="information-desk-description-container">
              <div
                part="information-desk-description"
                class={this.displayShortDescription ? 'information-desk-description information-desk-description-short' : 'information-desk-description'}
                innerHTML={this.informationDesk.description}
                ref={el => (this.descriptionRef = el)}
              ></div>
              {false && (
                <div part="handle-information-desk-description" class="handle-information-desk-description" onClick={() => this.handleInformationDeskDescription()}>
                  {this.displayShortDescription ? translate[state.language].readMore : translate[state.language].readLess}
                </div>
              )}
            </div>
          )}
        </div>
      </Host>
    );
  }
}
