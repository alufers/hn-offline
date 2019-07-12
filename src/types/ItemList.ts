import ItemListKind from "./ItemListKind.enum";

export default interface ItemList {
  kind: ItemListKind;
  itemIds: number[];
  lastSync: Date;
}
