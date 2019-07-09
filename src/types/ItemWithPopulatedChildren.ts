import Item from "./Item";

interface ItemWithPopulatedChildren extends Item {
  populatedChildren: ItemWithPopulatedChildren[];
}

export default ItemWithPopulatedChildren;
