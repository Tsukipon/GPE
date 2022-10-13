import { Position, Toaster } from "@blueprintjs/core";

export const AppToaster = Toaster.create({
  className: "recipe-toaster",
  position: Position.RIGHT_BOTTOM,
  maxToasts: 3
});
